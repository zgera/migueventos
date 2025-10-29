import { EventService } from "../services/eventService";
import { EventRepository } from "../repositories/eventRepository";
import { TicketRepository } from "../repositories/ticketRepository";
import { TicketDetailRepository } from "../repositories/ticketDetailRepository";
import { BalanceService } from "../services/balanceService";
import { AuthorizationService } from "../services/authorizationService";
import { Ticket, Event, TicketDetail } from "@prisma/client";
import { TokenData } from "../types/auth";

jest.mock("../repositories/eventRepository");
jest.mock("../repositories/ticketRepository");
jest.mock("../repositories/ticketDetailRepository");
jest.mock("../services/balanceService");
jest.mock("../services/authorizationService");

describe("EventService tests ready to run", () => {
  let service: EventService;
  const token: TokenData = { userId: "user1", username: "john_doe" };

  const mockEventRepo = EventRepository as jest.Mocked<typeof EventRepository>;
  const mockTicketRepo = TicketRepository as jest.Mocked<typeof TicketRepository>;
  const mockTicketDetailRepo = TicketDetailRepository as jest.Mocked<typeof TicketDetailRepository>;
  const mockBalanceService = BalanceService as jest.Mocked<typeof BalanceService>;
  const mockAuthService = AuthorizationService as jest.Mocked<typeof AuthorizationService>;

  // Dummy Event para mocks de addAssistant
  const dummyEvent = {
    idEvent: "ev1",
    title: "Mi Evento",
    date: new Date(),
    description: "Desc",
    shortDescription: "Corta",
    direction: "Dir",
    creatorID: "user1",
    free: true,
    assistants: 0,
    cancelled: false,
    price: null,
    completed: false,
    imageURL: null,
  } as unknown as Event;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EventService();

    // mock addAssistant para que devuelva un Event válido
    mockEventRepo.addAssistant.mockImplementation(async () => dummyEvent);
  });

  // ACCESS EVENT
  it("should allow access to a free event", async () => {
    const event = { ...dummyEvent, free: true } as unknown as Event;
    const ticket = {
      idTicket: "t1",
      idEvent: "ev1",
      idUser: "user1",
      amount: 0,
      participants: 1,
    } as unknown as Ticket;

    mockEventRepo.getEventById.mockResolvedValue(event);
    mockTicketRepo.createTicket.mockResolvedValue(ticket);
    mockTicketDetailRepo.createTicketDetail.mockResolvedValue(
      {
        idTicketDetail: "d1",
        eventID: "ev1",
        ticketID: "t1",
        firstName: "John",
        lastName: "Doe",
        document: 123,
        amount: 0,
      } as unknown as TicketDetail
    );

    const participantsDetails = [{ firstName: "John", lastName: "Doe", document: 123 }];

    const result = await service.accessEvent(token, event.idEvent, 1, participantsDetails);

    expect(mockEventRepo.getEventById).toHaveBeenCalledWith("ev1");
    expect(mockTicketRepo.createTicket).toHaveBeenCalledWith("user1", "ev1", 1, 0);
    expect(mockEventRepo.addAssistant).toHaveBeenCalledWith(1, "ev1");
    expect(result).toEqual(ticket);
  });

  it("should throw if event already completed", async () => {
    const event = { ...dummyEvent, completed: true } as unknown as Event;
    mockEventRepo.getEventById.mockResolvedValue(event);

    await expect(service.accessEvent(token, "ev1", 1, [])).rejects.toThrow(
      "El evento ya ha finalizado"
    );
  });

  // LEAVE EVENT
  it("should allow leaving a free event", async () => {
    const event = { ...dummyEvent, free: true } as unknown as Event;
    const ticket = {
      idTicket: "t1",
      idEvent: "ev1",
      idUser: "user1",
      participants: 1,
    } as unknown as Ticket;

    mockTicketRepo.getTicket.mockResolvedValue(ticket);
    mockEventRepo.getEventById.mockResolvedValue(event);
    mockAuthService.assertParticipant.mockResolvedValue(undefined);

    await service.leaveEvent(token, ticket.idTicket);

    expect(mockTicketRepo.deleteTicket).toHaveBeenCalledWith("t1");
    expect(mockEventRepo.addAssistant).toHaveBeenCalledWith(-1, "ev1");
  });

  it("should throw when trying to leave a paid event", async () => {
    const paidEvent = { ...dummyEvent, free: false, price: 100 } as unknown as Event;
    const ticket = {
      idTicket: "t1",
      idEvent: "ev1",
      idUser: "user1",
    } as unknown as Ticket;

    mockTicketRepo.getTicket.mockResolvedValue(ticket);
    mockEventRepo.getEventById.mockResolvedValue(paidEvent);

    await expect(service.leaveEvent(token, ticket.idTicket)).rejects.toThrow(
      "No se puede salir de un evento pago"
    );
  });

  // CREATE EVENT
  it("should create event and register creator", async () => {
    const createdEvent = { ...dummyEvent, idEvent: "ev2", free: true } as unknown as Event;
    const ticket = {
      idTicket: "t2",
      idEvent: "ev2",
      idUser: "user1",
    } as unknown as Ticket;

    mockEventRepo.createEvent.mockResolvedValue(createdEvent);
    mockTicketRepo.createTicket.mockResolvedValue(ticket);
    mockTicketDetailRepo.createTicketDetail.mockResolvedValue(
      {
        idTicketDetail: "d2",
        ticketID: "t2",
        eventID: "ev2",
        firstName: "John",
        lastName: "Doe",
        document: 111,
        amount: 0,
      } as unknown as TicketDetail
    );

    (service["userService"].getUserById as any) = jest.fn().mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      document: 111,
    });

    const result = await service.createEvent(
      token,
      "title",
      "desc",
      "short",
      "dir",
      new Date(),
      null,
      true,
      null
    );

    expect(mockEventRepo.createEvent).toHaveBeenCalled();
    expect(mockTicketRepo.createTicket).toHaveBeenCalledWith("user1", "ev2", 1, 0);
    expect(mockEventRepo.addAssistant).toHaveBeenCalledWith(1, "ev2");
    expect(result).toEqual(createdEvent);
  });

  // DELETE EVENT
  it("should delete event with admin permission", async () => {
    const event = { ...dummyEvent } as unknown as Event;

    mockEventRepo.getEventById.mockResolvedValue(event);
    mockAuthService.assertAdmin.mockResolvedValue(undefined);
    mockEventRepo.deleteEvent.mockResolvedValue(event);

    const result = await service.deleteEvent(token, event.idEvent);

    expect(mockAuthService.assertAdmin).toHaveBeenCalledWith(token, event.idEvent);
    expect(mockEventRepo.deleteEvent).toHaveBeenCalledWith(event.idEvent);
    expect(result).toEqual(event);
  });
  
  // DUPLICATE PARTICIPANT TEST
  it("should throw when trying to add a participant with duplicate document", async () => {
    const event = { ...dummyEvent, free: true } as unknown as Event;
    const ticket = {
      idTicket: "t1",
      idEvent: "ev1",
      idUser: "user1",
      amount: 0,
      participants: 1,
    } as unknown as Ticket;

    const participant = { firstName: "John", lastName: "Doe", document: 123 };

    // Primer llamado: participante no existe
    mockEventRepo.getEventById.mockResolvedValue(event);
    mockTicketRepo.createTicket.mockResolvedValue(ticket);
    mockTicketDetailRepo.getDetailByDocumentAndEvent.mockResolvedValueOnce(null);
    mockTicketDetailRepo.createTicketDetail.mockResolvedValue(
      {
        idTicketDetail: "d1",
        eventID: "ev1",
        ticketID: "t1",
        firstName: "John",
        lastName: "Doe",
        document: 123,
        amount: 0,
      } as unknown as TicketDetail
    );

    const result = await service.accessEvent(token, event.idEvent, 1, [participant]);
    expect(result).toEqual(ticket);

    // Segundo intento con el mismo DNI: debe fallar
    mockTicketDetailRepo.getDetailByDocumentAndEvent.mockResolvedValueOnce(
      {} as unknown as TicketDetail
    );

    await expect(service.accessEvent(token, event.idEvent, 1, [participant])).rejects.toThrow(
      "Un participante ya asiste al evento"
    );
  });
});
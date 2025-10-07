import { TokenData } from "../types/auth";
import { BalanceService } from "./balanceService";

interface accessStrategy {
    access(token: TokenData, event: Event): Promise<Event>;
}

class PaidAccess implements accessStrategy {
    async access(token: TokenData, event: Event): Promise<Event> {
        await BalanceService.pay(token, event.cost);
        return event;
    }
}
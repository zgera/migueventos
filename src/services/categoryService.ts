enum EventCategory {
    CUMPLEAÑOS = "CUMPLEAÑOS",
    DEPORTE = "DEPORTE",
    CONCIERTO = "CONCIERTO",
    CASUAL = "CASUAL",
    SOCIAL = "SOCIAL",
    FIESTA = "FIESTA",
    OTRO = "OTRO"
}


function stringToEventTag(tagString: string): EventCategory {
  const upperTag = tagString.toUpperCase();

  if (Object.values(EventCategory).includes(upperTag as EventCategory)) {
    return upperTag as EventCategory;
  }
  
  return EventCategory.OTRO; 
}

export { EventCategory, stringToEventTag };
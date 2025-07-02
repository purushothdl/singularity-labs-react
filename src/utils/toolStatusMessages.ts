export const toolStatusMessages: { [key: string]: string } = {
    list_events: "Finding your events...",
    find_available_slots: "Searching for available slots...",
    update_user_timezone: "Updating your timezone...",
    confirm_and_book_event: "Confirming and booking the event...",
    delete_event: "Deleting the event...",
    update_event: "Updating the event...",
    propose_event: "Preparing event proposal...",
    generating_answer: "Putting together the final response...",
    // Add any other tool names here
  };
  
  export const getDefaultStatusMessage = () => "Processing your request...";
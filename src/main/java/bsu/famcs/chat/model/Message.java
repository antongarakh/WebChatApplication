package bsu.famcs.chat.model;


public class Message {
    private final String id;
    private String name;
    private String message;
    private String date;
    //private String changeDate;
    //private boolean isDeleted;

    public Message(String id, String userName, String msgText, String sendDate) {
        this.id = id;
        this.name = userName;
        this.message = msgText;
        this.date = sendDate;

    }


    public String getId() {
        return id;
    }

    public String getUserName() {
        return name;
    }

    public String getMessageText() {
        return message;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date)
    {
        this.date = date;
    }

    public void setMessage(String message)
    {

        this.message = message;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"message\":\"").append(message)
                .append("\", \"name\":\"").append(name)
                .append("\", \"id\":\"").append(id)
                .append("\"}");
        return sb.toString();
    }

    public String getUserMessage() {
        StringBuilder sb = new StringBuilder(getDate());
        sb.append(' ')
                .append(name)
                .append(" : ")
                .append(getMessageText());
        return sb.toString();
    }
}

package bsu.famcs.chat.controller;


import bsu.famcs.chat.model.Message;
import bsu.famcs.chat.model.MessageStorage;
import bsu.famcs.chat.storage.xml.XMLHistoryUtil;
import bsu.famcs.chat.util.ServletUtil;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.xml.sax.SAXException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.IOException;
import java.io.PrintWriter;

import static bsu.famcs.chat.util.MessageUtil.*;
import static bsu.famcs.chat.util.ServletUtil.APPLICATION_JSON;
import static bsu.famcs.chat.util.ServletUtil.getMessageBody;
import bsu.famcs.chat.dao.MessageDaoImpl;
@WebServlet("/chat")
public class MessageServlet extends HttpServlet {
    private boolean isStored = false;
    private static final long serialVersionUID = 1L;
    private static Logger logger = Logger.getLogger(MessageServlet.class.getName());
    MessageDaoImpl messageDao = new MessageDaoImpl();
    @Override
    public void init() throws ServletException {
        try {
            loadHistory();
        } catch (TransformerException | ParserConfigurationException | IOException | SAXException e) {
            logger.error(e);
        }
    }


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


        String token = request.getParameter(TOKEN);
        if (token != null && !"".equals(token)) {
            int index = getIndex(token);
            String messages = serverResponse(index);
            logger.info(messages);
            response.setContentType(APPLICATION_JSON);
            PrintWriter pw = response.getWriter();
            pw.print(messages);
            pw.flush();
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "token parameter is absent");
            logger.error("Token parameter is absent");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("Post request");
        String data = getMessageBody(request);
        logger.info("Request data : " + data);
        try {
            JSONObject json = stringToJson(data);
            Message message = jsonToMessage(json);
            logger.info(message.getUserMessage());
           // XMLHistoryUtil.addMessage(message);
            messageDao.add(message);
            MessageStorage.addMessage(message);
            System.out.println(MessageStorage.getSize());
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (ParseException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            logger.error("Invalid message");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("doDelete");
        String data = ServletUtil.getMessageBody(request);
        logger.info("data: " + data);
        try {
            JSONObject json = stringToJson(data);
            String id = json.get(ID).toString();
            Message newMessage = MessageStorage.getMessageById(id);
            if (newMessage != null) {
                newMessage.setDate(generateCurrentDate());
                newMessage.setMessage("");
                messageDao.update(newMessage);
                MessageStorage.updateMessage(newMessage);
                //XMLHistoryUtil.updateData(newMessage);
                logger.info("response status: " + 200);
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                logger.error("bad request");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Task does not exist");
            }
        } catch (Exception e) {
            logger.error("bad request");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    @Override
    protected void doPut (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("doPut");
        String data = ServletUtil.getMessageBody(request);
        logger.info("data: " + data);
        try {
            JSONObject json = stringToJson(data);
            String id = json.get(ID).toString();
            Message newMessage = MessageStorage.getMessageById(id);
            if (newMessage != null) {
                newMessage.setDate(generateCurrentDate());
                newMessage.setMessage(json.get(MESSAGE).toString());
                messageDao.update(newMessage);
                MessageStorage.updateMessage(newMessage);
               // XMLHistoryUtil.updateData(newMessage);
                logger.info("response status: " + 200);
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                logger.error("bad request");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Task does not exist");
            }
        } catch (Exception e) {
            logger.error("bad request");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    @SuppressWarnings("unchecked")
    private String serverResponse(int index) {
        if(isStored==false)
        {
            isStored=true;
            MessageStorage.addAll(messageDao.selectAll());
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(MESSAGES, MessageStorage.getSubHistory(index));
        jsonObject.put(TOKEN, getToken(MessageStorage.getSize()));
        return jsonObject.toJSONString();
    }


    private void loadHistory() throws TransformerException, ParserConfigurationException, IOException,
            SAXException{
        MessageStorage.addAll(messageDao.selectAll());
        logger.info('\n' + MessageStorage.getStringView());
        logger.info(MessageStorage.getSubHistory(0));
    }
}

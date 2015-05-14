package bsu.famcs.chat.controller;

import bsu.famcs.chat.model.Message;
import bsu.famcs.chat.model.MessageStorage;
import bsu.famcs.chat.storage.xml.XMLHistoryUtil;
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
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import static bsu.famcs.chat.util.MessageUtil.*;
import static bsu.famcs.chat.util.ServletUtil.APPLICATION_JSON;
import static bsu.famcs.chat.util.ServletUtil.getMessageBody;

@WebServlet("/chat")
public class MessageServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static Logger logger = Logger.getLogger(MessageServlet.class.getName());

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
            XMLHistoryUtil.addMessage(message);
            MessageStorage.addMessage(message);
            System.out.println(MessageStorage.getSize());
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (ParseException | ParserConfigurationException | SAXException | TransformerException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            logger.error("Invalid message");
        }
    }

    @SuppressWarnings("unchecked")
    private String serverResponse(int index) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(MESSAGES, MessageStorage.getSubHistory(index));
        jsonObject.put(TOKEN, getToken(MessageStorage.getSize()));
        return jsonObject.toJSONString();
    }


    private void loadHistory() throws TransformerException, ParserConfigurationException, IOException,
            SAXException {
        if (!XMLHistoryUtil.isStorageExist()) {
            XMLHistoryUtil.createStorage();
            logger.info(MessageStorage.getSubHistory(0));
        } else {
            MessageStorage.addAll(XMLHistoryUtil.getMessages());
            logger.info('\n' + MessageStorage.getStringView());
            logger.info(MessageStorage.getSubHistory(0));
        }
    }
}

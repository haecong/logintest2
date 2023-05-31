package com.example.loginTest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.transaction.Transactional;

@Service
public class LoginService {

    public String getAccessToken(String authorize_code) {
        String access_Token = "";
        String refresh_Token = "";
        String reqURL = "https://kauth.kakao.com/oauth/token";

        try {
            URL url = new URL(reqURL);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder();
            sb.append("grant_type=authorization_code");

            sb.append("&client_id=8c3b653106a5cfce99f5bb9e33325793");
            sb.append("&redirect_uri=http://localhost:8080/login");

            sb.append("&code=" + authorize_code);
            bw.write(sb.toString());
            bw.flush();

            int responseCode = conn.getResponseCode();
            System.out.println("responseCode : " + responseCode);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            String result = "";

            while ((line = br.readLine()) != null) {
                result += line;
            }
            System.out.println("response body : " + result);

            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(result);

            access_Token = element.getAsJsonObject().get("access_token").getAsString();
            refresh_Token = element.getAsJsonObject().get("refresh_token").getAsString();

            System.out.println("access_token : " + access_Token);
            System.out.println("refresh_token : " + refresh_Token);

            br.close();
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return access_Token;
    }

    @Autowired
    private LoginRepository lr;

    public LoginEntity getUserInfo(String access_Token) {
        HashMap<String, Object> userInfo = new HashMap<String, Object>();
        String reqURL = "https://kapi.kakao.com/v2/user/me";
        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            conn.setRequestProperty("Authorization", "Bearer " + access_Token);

            int responseCode = conn.getResponseCode();
            System.out.println("responseCode : " + responseCode);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String line = "";
            String result = "";

            while ((line = br.readLine()) != null) {
                result += line;
            }
            System.out.println("response body : " + result);

            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(result);

            JsonObject properties = element.getAsJsonObject().get("properties").getAsJsonObject();
            JsonObject kakao_account = element.getAsJsonObject().get("kakao_account").getAsJsonObject();

            String nickname = properties.getAsJsonObject().get("nickname").getAsString();
            String email = kakao_account.getAsJsonObject().get("email").getAsString();

            userInfo.put("nickname", nickname);
            userInfo.put("email", email);

            System.out.println(element);


        } catch (IOException e) {
            e.printStackTrace();
        }
        //정보가 저장되어 있는지 확인하는 코드
        LoginEntity result = lr.findByKnameAndKemail(userInfo.get("nickname").toString(), userInfo.get("email").toString());
        System.out.println("S:" + result);
        //result가 null이면 정보가 저장되어있지 않음, 정보 저장
        if(result == null) {
            LoginEntity newLoginEntity = new LoginEntity();
            //정보를 저장하기위해 repository로 보냄
            newLoginEntity.setKname(userInfo.get("nickname").toString());
            newLoginEntity.setKemail(userInfo.get("email").toString());
            lr.save(newLoginEntity);
            //정보를 저장 후 컨트롤러에 정보를 보냄
            return lr.findByKnameAndKemail(userInfo.get("nickname").toString(), userInfo.get("email").toString());
        } else {
            //정보가 이미 있으므로 result를 리
            return result;
        }
    }
}

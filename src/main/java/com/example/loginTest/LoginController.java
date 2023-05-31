package com.example.loginTest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;

@Controller
public class LoginController {

    @Autowired
    private LoginService ls;

    @Autowired
    private HttpSession session;

    @GetMapping("/")
    public String home() {
        return "login";
    }
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login(@RequestParam(value = "code", required = false) String code, Model model) throws Exception{
        System.out.println("#########" + code);

        String access_Token = ls.getAccessToken(code);

        LoginEntity userInfo = ls.getUserInfo(access_Token);
        System.out.println("###access_Token### : " + access_Token);
        System.out.println("###nickname###" + userInfo.getKname());
        System.out.println("###email###" + userInfo.getKemail());

        session.invalidate();
        session.setAttribute("kakaoN", userInfo.getKname());
        session.setAttribute("kakaoE", userInfo.getKemail());

        model.addAttribute("kakaoN", userInfo.getKname());
        model.addAttribute("kakaoE", userInfo.getKemail());

        return "testPage";
    }

}


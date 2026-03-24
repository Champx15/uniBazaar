package com.champ.UniBazaar.config;


import com.champ.UniBazaar.service.UserBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Service
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private MyUserDetailService userDetailService;
    @Autowired private UserBlacklistService userBlacklistService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        String authorization = request.getHeader("Authorization");
        Cookie[] cookies = request.getCookies();

        String token=null;
        String id=null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("accessToken")) {
                    token = cookie.getValue();
                    id=jwtService.extractUserName(token);
                }
            }
        }

        //Blacklist check
        if (token != null && userBlacklistService.isBlacklisted(Long.parseLong(id))) {
            response.setStatus(403);
            response.setContentType("application/json");
            response.getWriter().write("{\"code\":\"USER_BANNED\"}");
            return;
        }


//        if(authorization !=null && authorization.startsWith("Bearer ")){
//            token = authorization.substring(7);
//            id = jwtService.extractUserName(token);
//
//        }
        if(id !=null && SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails userDetails = userDetailService.loadUserById(Long.parseLong(id));
            Boolean status =jwtService.validateToken(token,userDetails);
            if(status){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null,userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request,response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/auth/");
    }
}

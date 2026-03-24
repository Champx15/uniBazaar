package com.champ.UniBazaar.config;

import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.repo.ProfileRepo;
import com.champ.UniBazaar.enums.UserStatus;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtFilter jwtFilter;
    @Autowired private ProfileRepo repo;
    @Autowired private JwtService jwtService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(Customizer -> Customizer.configurationSource(corsConfigurationSource()));

//        http.httpBasic(Customizer.withDefaults());
        http.formLogin(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(auth -> auth.requestMatchers("/auth/**","/oauth2/**","/login/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/listings", "/listings/*").permitAll()
                .requestMatchers("/listings/user").authenticated()
                .requestMatchers("/admin/**").hasAuthority("ADMIN").anyRequest().authenticated());
        http.exceptionHandling(ex ->
                ex.authenticationEntryPoint((req, res, e) ->
                        res.sendError(HttpServletResponse.SC_UNAUTHORIZED)
                )
        );
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.oauth2Login(oauth2 -> oauth2
                .successHandler(oauth2AuthenticationSuccessHandler()));
        return http.build();


    }

    private AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler() {
        return (request, response, authentication) -> {
            SavedRequest savedRequest = new HttpSessionRequestCache().getRequest(request, response);
            String targetUrl = (savedRequest != null) ? savedRequest.getRedirectUrl() : "https://uni-bazaar-nu.vercel.app/";
            // Get OAuth2 user info
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");
            String pfImageUrl = oAuth2User.getAttribute("picture");

            User user = repo.findByEmail(email).orElseGet(() ->{
                User newUser = new User(email,null,name,pfImageUrl,null);
                return repo.save(newUser);
            });
            if (user.getStatus().equals(UserStatus.BANNED)) {
                response.sendRedirect("https://uni-bazaar-nu.vercel.app/banned");
                return;
            }

            String token = jwtService.generateToken(user.getId().toString(),user.getEmail());
            Cookie jwtCookie = new Cookie("accessToken", token);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(true); // only over HTTPS
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(60 * 60);
            jwtCookie.setAttribute("SameSite", "Lax");
            response.addCookie(jwtCookie);
            // Redirect with token or return JSON
            response.sendRedirect(targetUrl);
        };
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "https://uni-bazaar-nu.vercel.app/"


        ));
        config.setAllowedMethods(List.of("GET","POST","DELETE","OPTIONS","PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


    @Bean
    public AuthenticationProvider authProvider(){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        return daoAuthenticationProvider;

    }
    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return  config.getAuthenticationManager();
    }

}

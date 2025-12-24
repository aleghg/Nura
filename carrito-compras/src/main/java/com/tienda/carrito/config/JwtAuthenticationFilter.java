package com.tienda.carrito.config;

import com.tienda.carrito.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // 1️⃣ Extraer token del header
        String authHeader = request.getHeader("Authorization");
        System.out.println("HEADER AUTH POSTMAN: '" + authHeader + "'");
        
        // 🔓 No filtrar para login/registro
        if (path.startsWith("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();

        System.out.println("TOKEN: " + token);
        System.out.println("EMAIL: " + jwtUtil.extractEmail(token));
        System.out.println("ROL: " + jwtUtil.extractRol(token));
        System.out.println("AUTH SET ANTES: " +
                SecurityContextHolder.getContext().getAuthentication());


        try {
            String email = jwtUtil.extractEmail(token);

            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                // 👤 Cargar usuario desde BD
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                // ✅ Validar token
                if (jwtUtil.validateToken(token, userDetails.getUsername())) {

                    // ⭐ LEER ROL DEL JWT
                    String rol = jwtUtil.extractRol(token); // ADMIN / CLIENTE

                    // ⭐ PREFIJO ROLE_ (CLAVE)
                    List<GrantedAuthority> authorities =
                            List.of(new SimpleGrantedAuthority("ROLE_" + rol));

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    authorities
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);
                    // 🔹 DEBUG FINAL: ver que Spring ya reconoce la auth
                    System.out.println("✅ AUTH FINAL: " +
                            SecurityContextHolder.getContext().getAuthentication());


                }
            }

        } catch (Exception ex) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }


}

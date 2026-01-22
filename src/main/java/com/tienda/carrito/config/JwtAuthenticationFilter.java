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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);



    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // 1️⃣ Extraer token del header
        String authHeader = request.getHeader("Authorization");
        logger.info("HEADER AUTH POSTMAN: '{}'", authHeader);

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

        logger.info("TOKEN: {}", token);
        logger.info("EMAIL extraído: {}", jwtUtil.extractEmail(token));
        logger.info("ROL extraído: {}", jwtUtil.extractRol(token));
        logger.info("AUTH SET ANTES: {}", SecurityContextHolder.getContext().getAuthentication());


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

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // 🔹 DEBUG FINAL: ver que Spring ya reconoce la auth
                    logger.info("✅ AUTH FINAL: {}", SecurityContextHolder.getContext().getAuthentication());
                }
            }

        } catch (Exception ex) {
            logger.error("Error validando token: {}", ex.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido: " + ex.getMessage());
            return; // Muy importante para que no continue el filtro
        }

        filterChain.doFilter(request, response);
    }


}

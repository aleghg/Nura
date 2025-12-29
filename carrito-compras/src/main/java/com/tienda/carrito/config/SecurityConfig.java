package com.tienda.carrito.config;

import com.tienda.carrito.security.JwtAccessDeniedHandler;
import com.tienda.carrito.security.JwtAuthenticationEntryPoint;
import com.tienda.carrito.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthEntryPoint;

    @Autowired
    private JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // 🔓 AUTH PÚBLICO
                        .requestMatchers("/auth/**").permitAll()

                        // 👑 ADMIN - CARRITO (PRIMERO)
                        .requestMatchers(HttpMethod.PUT, "/carrito/admin/**").hasRole("ADMIN")


                        // 🛒 CLIENTE (EXCEPCIONES ANTES DEL MATCHER GENERAL)
                        .requestMatchers(HttpMethod.POST, "/carrito/agregar").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/carrito/mio").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.DELETE, "/carrito/eliminar/**").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.DELETE, "/carrito/vaciar").hasRole("CLIENTE")

                        // 🛒 CARRITO GENERAL (fallback)
                        .requestMatchers("/carrito/**").hasAnyRole("CLIENTE", "ADMIN")

                        // 📦 PEDIDOS
                        .requestMatchers(HttpMethod.POST, "/pedidos/crear").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/pedidos/mios/**").hasRole("CLIENTE")
                        .requestMatchers("/pedidos/**").hasRole("ADMIN")

                        // 🧑‍💼 ADMIN OTROS
                        .requestMatchers("/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categorias/**").hasRole("ADMIN")


                        // 👤 LECTURA ( CLIENTE / ADMIN)
                        .requestMatchers(HttpMethod.GET, "/productos/**").hasAnyRole("ADMIN", "CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/categorias/**").hasAnyRole("ADMIN", "CLIENTE")

                        // 🔐 RESTO
                        .anyRequest().authenticated()
                )

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                )

                /*.authenticationProvider(authenticationProvider())*/
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
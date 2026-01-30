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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

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
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // tu servicio que carga usuarios
        authProvider.setPasswordEncoder(passwordEncoder());      // BCrypt
        return authProvider;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // =============================
                        // 🔓 ENDPOINTS PÚBLICOS
                        // =============================
                        .requestMatchers(
                                "/auth/**",
                                "/productos/**",
                                "/categorias/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/productos/featured").permitAll()
                        .requestMatchers(HttpMethod.GET, "/productos/categoria/**").permitAll()



                        // 🔐 Endpoint de perfil de usuario logueado
                        .requestMatchers("/usuarios/me").hasAnyRole("CLIENTE","ADMIN")

                        // ADMIN solo
                        .requestMatchers("/usuarios/**").hasRole("ADMIN")

                        // =============================
                        // 👑 ADMIN - CARRITO
                        // =============================
                        .requestMatchers(HttpMethod.PUT, "/carrito/admin/**").hasRole("ADMIN")

                        // =============================
                        // 🛒 CLIENTE
                        // =============================
                        .requestMatchers(HttpMethod.POST, "/carrito/agregar").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/carrito/mio").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.DELETE, "/carrito/eliminar/**").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.DELETE, "/carrito/vaciar").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.POST, "/payments/create").hasRole("CLIENTE")


                        // 🛒 CARRITO GENERAL
                        .requestMatchers("/carrito/**").hasAnyRole("CLIENTE", "ADMIN")

                        // =============================
                        // 📦 PEDIDOS
                        // =============================
                        .requestMatchers(HttpMethod.POST, "/pedidos/crear").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/pedidos/mios/**").hasRole("CLIENTE")
                        .requestMatchers("/pedidos/**").hasRole("ADMIN")

                        // =============================
                        // 🧑‍💼 ADMIN
                        // =============================
                        .requestMatchers("/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categorias/**").hasRole("ADMIN")

                        // =============================
                        // 🔐 RESTO
                        // =============================
                        .anyRequest().authenticated()


                )

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                )

                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }



    // ✅ PASO 2: Bean de configuración global de CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 🔹 Solo tu frontend
        configuration.addAllowedOrigin("http://localhost:4200");

        // 🔹 Permitir solo métodos necesarios
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 🔹 Permitir solo headers necesarios
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // 🔹 Permitir envío de cookies o headers de autorización
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
package com.student.management_system.config;

import com.student.management_system.security.JwtAuthenticationFilter;
import com.student.management_system.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
            UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder)
            throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http
                .getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // ADMIN only routes
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // TEACHER only routes
                        .requestMatchers("/api/teacher/**").hasRole("TEACHER")

                        // // STUDENT only routes
                        // .requestMatchers("/api/student/**").hasRole("STUDENT")

                        // SCHOOL routes — GET for everyone
                        .requestMatchers(HttpMethod.GET, "/api/school/**")
                        .hasAnyRole("ADMIN", "TEACHER", "STUDENT")

                        // SCHOOL routes — POST: admin + teacher can post announcements/notes
                        // student can apply leave
                        .requestMatchers(HttpMethod.POST, "/api/school/**")
                        .hasAnyRole("ADMIN", "TEACHER", "STUDENT") // ✅ FIXED: added STUDENT

                        // SCHOOL routes — PATCH: only admin + teacher can approve/reject leave
                        .requestMatchers(HttpMethod.PATCH, "/api/school/**")
                        .hasAnyRole("ADMIN", "TEACHER")

                        // TASK routes
                        .requestMatchers(HttpMethod.GET, "/api/tasks/**")
                        .hasAnyRole("ADMIN", "TEACHER", "STUDENT")

                        // Allow admin and teacher to VIEW student data
                        .requestMatchers(HttpMethod.GET, "/api/student/**")
                        .hasAnyRole("STUDENT", "ADMIN", "TEACHER")

                        // Only student can POST/PUT their own data
                        .requestMatchers(HttpMethod.POST, "/api/student/**").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.PUT, "/api/student/**").hasRole("STUDENT")
                                                               
                        // Allow students (and teacher/admin) to submit an assignment
                        .requestMatchers(HttpMethod.POST, "/api/tasks/submit/**")
                        .hasAnyRole("ADMIN", "TEACHER", "STUDENT")

                        // All other task POST operations are teacher/admin only
                        .requestMatchers(HttpMethod.POST, "/api/tasks/**")
                        .hasAnyRole("ADMIN", "TEACHER")

                        .requestMatchers(HttpMethod.DELETE, "/api/tasks/**")
                        .hasAnyRole("ADMIN", "TEACHER")

                        .requestMatchers(HttpMethod.PATCH, "/api/tasks/**")
                        .hasAnyRole("ADMIN", "TEACHER")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "https://*.vercel.app",
                "http://localhost:5173",
                "http://localhost:3000"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

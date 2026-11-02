package br.pucminas.aluguel.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import br.pucminas.aluguel.model.Usuario;

@Service
public class TokenService {

    private static final long HORAS_VALIDADE = 8;

    private final JwtEncoder jwtEncoder;

    public TokenService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    // Gera o token que o front-end guarda depois do login. Dentro dele vai o id
    // do usuário (subject), o login e o perfil, assim a API sabe quem está
    // chamando sem precisar consultar o banco a cada requisição.
    public String gerarToken(Usuario usuario) {
        Instant agora = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("aluguel-api")
                .issuedAt(agora)
                .expiresAt(agora.plus(HORAS_VALIDADE, ChronoUnit.HOURS))
                .subject(usuario.getId().toString())
                .claim("login", usuario.getLogin())
                .claim("perfil", usuario.getPerfil())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}

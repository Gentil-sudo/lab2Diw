package br.pucminas.aluguel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucminas.aluguel.model.Automovel;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    boolean existsByMatricula(String matricula);

    boolean existsByPlaca(String placa);
}

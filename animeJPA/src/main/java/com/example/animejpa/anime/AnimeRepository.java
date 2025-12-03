package com.example.animejpa.anime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimeRepository extends JpaRepository<Anime, Integer>{

    // Custom Query: Finds animes where the title contains the keyword (Case Insensitive)
    // SQL equivalent: SELECT * FROM details WHERE title ILIKE '%keyword%'
    List<Anime> findByTitleContainingIgnoreCase(String title);
}
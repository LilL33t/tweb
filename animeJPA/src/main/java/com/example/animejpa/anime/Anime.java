package com.example.animejpa.anime;

import jakarta.persistence.*;

@Entity
@Table(name = "details")
public class Anime{

    @Id
    @Column(name = "mal_id")
    private Integer malId;

    @Column(name = "title")
    private String title;

    @Column(name = "title_japanese")
    private String titleJapanese;

    @Column(name = "score")
    private Double score;

    @Column(name = "type")
    private String type;

    @Column(name = "episodes")
    private Integer episodes;

    @Column(name = "synopsis", columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "genres")
    private String genres;

    @Column(name = "studios")
    private String studios;

    @Column(name = "year")
    private Integer year;

    public Anime() {
    }

    public Integer getMalId() {
        return malId;
    }

    public void setMalId(Integer malId) {
        this.malId = malId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitleJapanese() {
        return titleJapanese;
    }

    public void setTitleJapanese(String titleJapanese) {
        this.titleJapanese = titleJapanese;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Integer getEpisodes() {
        return episodes;
    }

    public void setEpisodes(Integer episodes) {
        this.episodes = episodes;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public String getStudios() {
        return studios;
    }

    public void setStudios(String studios) {
        this.studios = studios;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    // =========================================================
    // 3. TO STRING (Optional, helps debugging)
    // =========================================================

    @Override
    public String toString() {
        return "Anime{" +
                "malId=" + malId +
                ", title='" + title + '\'' +
                ", score=" + score +
                '}';
    }
}

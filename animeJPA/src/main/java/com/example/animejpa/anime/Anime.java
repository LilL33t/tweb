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

    @Column(name = "season")
    private String season;

    @Column(name = "status")
    private String status;

    @Column(name = "favorites")
    private Integer favorites;

    @Column(name = "source")
    private String source;

    @Column(name = "rating")
    private String rating;

    @Column(name = "producers", columnDefinition = "TEXT")
    private String producers;


    @Column(name = "licensors")
    private String licensors;

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

    public String getSeason() {
        return season;
    }

    public void setSeason(String season){
        this.season = season;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public Integer getFavorites() {
        return favorites;
    }

    public void setFavorites(Integer favorites) {
        this.favorites = favorites;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getProducers() {
        return producers;
    }

    public void setProducers(String producers) {
        this.producers = producers;
    }

    public String getLicensors() {
        return licensors;
    }

    public void setLicensors(String licensors) {
        this.licensors = licensors;
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

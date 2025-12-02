package com.example.animejpa.character;

import jakarta.persistence.*;

@Entity
@Table(name = "characters")
public class Character {

    @Id
    @Column(name = "character_mal_id")
    private Integer id;

    @Column(name = "url")
    private String url;

    @Column(name = "name")
    private String name;

    @Column(name = "name_kanji")
    private String nameKanji;

    @Column(name = "image")
    private String image;

    @Column(name = "favorites")
    private Integer favorites;

    @Column(name = "about", columnDefinition = "TEXT")
    private String about;

    public Character(){}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameKanji() {
        return nameKanji;
    }

    public void setNameKanji(String nameKanji) {
        this.nameKanji = nameKanji;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getFavorites() {
        return favorites;
    }

    public void setFavorites(Integer favorites) {
        this.favorites = favorites;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }
}
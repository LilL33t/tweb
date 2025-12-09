package com.example.animejpa.dto;

public interface PersonPositionDTO {
    String getName();
    String getJob();
    String getImageUrl();
    Integer getId(); // person_mal_id

    String getBirthday();
    Integer getMemberFavorites();
    String getWebsiteUrl();
    String getRelevantLocation();
}
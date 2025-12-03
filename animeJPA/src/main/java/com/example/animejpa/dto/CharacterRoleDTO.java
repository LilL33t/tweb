package com.example.animejpa.dto;

// This is a DTO, so SpringBoot will fill these fields for us with the results of the query!
//we must declare it as an interface (which we know from the ppoo course it's an abstract class)
public interface CharacterRoleDTO {
    String getName();
    String getRole();
    String getImageUrl();
    Integer getId();
}
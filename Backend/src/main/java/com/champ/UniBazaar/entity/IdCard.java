package com.champ.UniBazaar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "id_cards")
@NoArgsConstructor
@Getter
@Setter
public class IdCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    @JsonIgnore
    private String idCardUrl;
    private String status="PENDING";//VERIFIED,PENDING,REJECTED
    @CreationTimestamp
    private Timestamp createdAt;

    public IdCard(User user, String idCardUrl){
        this.user= user;
        this.idCardUrl=idCardUrl;
    }


}

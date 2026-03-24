package com.champ.UniBazaar.entity;

import com.champ.UniBazaar.enums.UserRole;
import com.champ.UniBazaar.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name="users")
@NoArgsConstructor
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String email;
    @JsonIgnore
    private String passHash;
    private String name;
    private String pfImageUrl;
    @Column(unique = true)
    @JsonIgnore
    private Long enrollmentNo;
    @Enumerated(EnumType.STRING)
    private UserStatus status=UserStatus.UNVERIFIED;
    @CreationTimestamp
    private Timestamp createdAt;
    @Enumerated(EnumType.STRING)
    private UserRole role=UserRole.USER;
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Listing> listings;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private IdCard idCard;
    @Transient
    @JsonProperty("hasEnrollment")
    public Boolean getHasEnrollment() {
        return this.enrollmentNo != null;
    }

    @Transient
    @JsonProperty("idCard")
    public IdCard getIdCardInfo() {
        if (idCard == null) return null;

        IdCard info = new IdCard();
        info.setStatus(idCard.getStatus());
        return info;
    }


    public User(String email, String passHash, String name, String pfImageUrl,Long enrollmentNo) {
        this.email = email;
        this.passHash = passHash;
        this.name = name;
        this.pfImageUrl = pfImageUrl;
        this.enrollmentNo=enrollmentNo;
    }

}

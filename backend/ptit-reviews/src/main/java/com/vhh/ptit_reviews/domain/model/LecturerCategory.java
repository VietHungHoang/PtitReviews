package com.vhh.ptit_reviews.domain.model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("Lecturer")
public class LecturerCategory extends Category {
    @OneToMany(mappedBy = "lecturerCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lecturer> lecturers;
}

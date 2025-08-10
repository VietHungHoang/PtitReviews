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
@DiscriminatorValue("Subject")
public class SubjectCategory extends Category{
    @OneToMany(mappedBy = "subjectCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subject> subjects;
}

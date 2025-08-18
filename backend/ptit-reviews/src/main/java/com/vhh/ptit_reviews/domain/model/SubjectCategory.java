package com.vhh.ptit_reviews.domain.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SubjectCategory")
public class SubjectCategory extends Category {
    // Không cần OneToMany với Subject nữa vì Subject giờ reference trực tiếp đến Category
}

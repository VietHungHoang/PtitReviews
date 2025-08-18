package com.vhh.ptit_reviews.domain.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("LecturerCategory")
public class LecturerCategory extends Category {
    // Không cần OneToMany với Lecturer nữa vì Lecturer giờ reference trực tiếp đến Category
}

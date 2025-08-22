package com.example.bookinventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("select b from Book b where lower(b.title) like lower(concat('%', ?1, '%')) or lower(b.author) like lower(concat('%', ?1, '%')) or lower(b.isbn) like lower(concat('%', ?1, '%'))")
    List<Book> search(String q);
}

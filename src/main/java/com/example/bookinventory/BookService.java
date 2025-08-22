package com.example.bookinventory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class BookService {
    private final BookRepository repo;
    public BookService(BookRepository repo) {
        this.repo = repo;
    }
    public List<Book> findAll() { return repo.findAll(); }
    public List<Book> search(String q) { return repo.search(q); }
    public Book findById(Long id) { return repo.findById(id).orElseThrow(() -> new RuntimeException("Book not found")); }
    public Book create(Book b) { return repo.save(b); }
    public Book update(Long id, Book b) {
        Book existing = findById(id);
        existing.setTitle(b.getTitle());
        existing.setAuthor(b.getAuthor());
        existing.setIsbn(b.getIsbn());
        existing.setPrice(b.getPrice());
        existing.setStock(b.getStock());
        return repo.save(existing);
    }
    public void delete(Long id) { repo.deleteById(id); }
}

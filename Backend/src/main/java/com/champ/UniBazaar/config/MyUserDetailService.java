package com.champ.UniBazaar.config;

import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.repo.ProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailService implements UserDetailsService {
    @Autowired
    private ProfileRepo repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repo.findByEmail(email).orElseThrow(() -> new RuntimeException("User doesn't exist"));
        if (user == null) throw new UsernameNotFoundException("User doesn't exist");
        return new UserPrincipal(user);

    }

    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        User user = repo.findById(id).orElseThrow(() -> new UsernameNotFoundException("User doesn't exist"));
        return new UserPrincipal(user);
    }
}

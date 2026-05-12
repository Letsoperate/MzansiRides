package com.mzansirides.config;

import com.mzansirides.model.*;
import com.mzansirides.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AdminRepository adminRepo;
    private final CarRepository carRepo;
    private final DriverApplicationRepository driverRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(AdminRepository ar, CarRepository cr,
                      DriverApplicationRepository dr, PasswordEncoder pe) {
        this.adminRepo = ar; this.carRepo = cr;
        this.driverRepo = dr; this.encoder = pe;
    }

    @Override
    public void run(String... args) {
        if (adminRepo.count() == 0) {
            Admin a = new Admin(); a.setFullName("Lintshiwe Pontsho Ntoampi");
            a.setEmail("ntoampilp@gmail.com"); a.setPasswordHash(encoder.encode("Mzansi@2026"));
            a.setRole("SUPER_ADMIN"); a.setActive(true);
            a.setCreatedAt(LocalDateTime.now()); adminRepo.save(a);
            Admin b = new Admin(); b.setFullName("MzansiRides Admin");
            b.setEmail("ntoampilp@gmail.com"); b.setPasswordHash(encoder.encode("Mzansi@2026"));
            b.setRole("SUPER_ADMIN"); b.setActive(true);
            b.setCreatedAt(LocalDateTime.now()); adminRepo.save(b);
        }

        if (carRepo.count() == 0) {
            carRepo.save(car("Toyota Corolla","Sedan",780,"available",img("Toyota+Corolla","1a1a2e","e94560"),"Reliable sedan for city driving and daily commutes"));
            carRepo.save(car("Volkswagen Polo","Hatchback",690,"available",img("Volkswagen+Polo","16213e","4ade80"),"Compact fuel-efficient hatchback ideal for urban travel"));
            carRepo.save(car("Ford Everest","SUV",1490,"available",img("Ford+Everest","0f3460","f59e0b"),"Spacious family SUV built for Mzansi roads"));
            carRepo.save(car("BMW 3 Series","Luxury",2150,"maintenance",img("BMW+3+Series","1a1a2e","a78bfa"),"Executive luxury sedan — undergoing premium detailing"));
            carRepo.save(car("Toyota Hilux","Utility",1320,"booked",img("Toyota+Hilux","16213e","38bdf8"),"Rugged double-cab bakkie for work and adventure"));
            carRepo.save(car("Honda Civic","Sedan",820,"available",img("Honda+Civic","0f3460","e94560"),"Modern sedan with excellent fuel economy"));
            carRepo.save(car("Audi A4","Luxury",1900,"available",img("Audi+A4","1a1a2e","a78bfa"),"Premium German engineering for first-class driving"));
            carRepo.save(car("Hyundai Tucson","SUV",1100,"available",img("Hyundai+Tucson","0f3460","f59e0b"),"Versatile mid-size SUV trusted across South Africa"));
        }

        if (driverRepo.count() == 0) {
            driverRepo.save(driver("S. Dlamini","s.dlamini@email.co.za","+27871112233","Johannesburg","pending"));
            driverRepo.save(driver("R. Van Wyk","r.vanwyk@email.co.za","+27872223344","Cape Town","pending"));
            driverRepo.save(driver("N. Mokoena","n.mokoena@email.co.za","+27873334455","Durban","approved"));
        }
    }

    private Car car(String n, String c, int r, String s, String i, String d) {
        Car car = new Car(); car.setName(n); car.setCategory(c);
        car.setDailyRate(BigDecimal.valueOf(r)); car.setStatus(s);
        car.setImage(i); car.setDescription(d); return car;
    }
    private DriverApplication driver(String n, String e, String p, String c, String s) {
        DriverApplication d = new DriverApplication(); d.setApplicantName(n);
        d.setEmail(e); d.setPhone(p); d.setCity(c); d.setStatus(s);
        d.setSubmittedAt(LocalDateTime.now()); return d;
    }
    private static String img(String n, String bg, String ac) {
        return "https://placehold.co/600x400/"+bg+"/"+ac+"?text="+n+"&font=raleway";
    }
}

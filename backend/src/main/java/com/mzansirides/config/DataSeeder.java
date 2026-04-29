package com.mzansirides.config;

import com.mzansirides.model.Admin;
import com.mzansirides.model.Car;
import com.mzansirides.repository.AdminRepository;
import com.mzansirides.repository.CarRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final CarRepository carRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AdminRepository adminRepository, CarRepository carRepository,
                      PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.carRepository = carRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setFullName("Lintshiwe Pontsho Ntoampi");
            admin.setEmail("ntoampilp@gmail.com");
            admin.setPasswordHash(passwordEncoder.encode("Mzansi@2026"));
            admin.setCreatedAt(LocalDateTime.now());
            adminRepository.save(admin);

            Admin superAdmin = new Admin();
            superAdmin.setFullName("MzansiRides Super Admin");
            superAdmin.setEmail("admin@mzansirides.co.za");
            superAdmin.setPasswordHash(passwordEncoder.encode("Mzansi@2026"));
            superAdmin.setCreatedAt(LocalDateTime.now());
            adminRepository.save(superAdmin);
        }

        if (carRepository.count() == 0) {
            carRepository.save(createCar("Toyota Corolla", "Sedan", 780, "available",
                    img("Toyota+Corolla", "1a1a2e", "e94560"),
                    "Reliable sedan for city driving and daily commutes"));

            carRepository.save(createCar("Volkswagen Polo", "Hatchback", 690, "available",
                    img("Volkswagen+Polo", "16213e", "4ade80"),
                    "Compact fuel-efficient hatchback ideal for urban travel"));

            carRepository.save(createCar("Ford Everest", "SUV", 1490, "available",
                    img("Ford+Everest", "0f3460", "f59e0b"),
                    "Spacious family SUV built for Mzansi roads"));

            carRepository.save(createCar("BMW 3 Series", "Luxury", 2150, "maintenance",
                    img("BMW+3+Series", "1a1a2e", "a78bfa"),
                    "Executive luxury sedan — undergoing premium detailing"));

            carRepository.save(createCar("Toyota Hilux", "Utility", 1320, "booked",
                    img("Toyota+Hilux", "16213e", "38bdf8"),
                    "Rugged double-cab bakkie for work and adventure"));

            carRepository.save(createCar("Honda Civic", "Sedan", 820, "available",
                    img("Honda+Civic", "0f3460", "e94560"),
                    "Modern sedan with excellent fuel economy"));

            carRepository.save(createCar("Audi A4", "Luxury", 1900, "available",
                    img("Audi+A4", "1a1a2e", "a78bfa"),
                    "Premium German engineering for first-class driving"));

            carRepository.save(createCar("Hyundai Tucson", "SUV", 1100, "available",
                    img("Hyundai+Tucson", "0f3460", "f59e0b"),
                    "Versatile mid-size SUV trusted across South Africa"));
        }
    }

    private static String img(String name, String bg, String accent) {
        return "https://placehold.co/600x400/" + bg + "/" + accent
                + "?text=" + name + "&font=raleway";
    }

    private Car createCar(String name, String category, int dailyRate, String status, String image, String description) {
        Car car = new Car();
        car.setName(name);
        car.setCategory(category);
        car.setDailyRate(BigDecimal.valueOf(dailyRate));
        car.setStatus(status);
        car.setImage(image);
        car.setDescription(description);
        return car;
    }
}

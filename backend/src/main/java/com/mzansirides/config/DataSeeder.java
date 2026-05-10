package com.mzansirides.config;

import com.mzansirides.model.*;
import com.mzansirides.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AdminRepository adminRepo;
    private final CarRepository carRepo;
    private final BookingRepository bookingRepo;
    private final DriverApplicationRepository driverRepo;
    private final SupportTicketRepository ticketRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(AdminRepository ar, CarRepository cr, BookingRepository br,
                      DriverApplicationRepository dr, SupportTicketRepository tr, PasswordEncoder pe) {
        this.adminRepo = ar; this.carRepo = cr; this.bookingRepo = br;
        this.driverRepo = dr; this.ticketRepo = tr; this.encoder = pe;
    }

    @Override
    public void run(String... args) {
        if (adminRepo.count() == 0) {
            Admin a = new Admin(); a.setFullName("Lintshiwe Pontsho Ntoampi");
            a.setEmail("ntoampilp@gmail.com"); a.setPasswordHash(encoder.encode("Mzansi@2026"));
            a.setCreatedAt(LocalDateTime.now()); adminRepo.save(a);
            Admin b = new Admin(); b.setFullName("MzansiRides Admin");
            b.setEmail("ntoampilp@gmail.com"); b.setPasswordHash(encoder.encode("Mzansi@2026"));
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

        if (bookingRepo.count() == 0) {
            bookingRepo.save(booking("K. Ndlovu","Johannesburg","Toyota Corolla","+27831234567","k.ndlovu@email.co.za","active", LocalDate.of(2026,5,2)));
            bookingRepo.save(booking("T. Adams","Cape Town","Volkswagen Polo","+27839876543","t.adams@email.co.za","pending_approval", LocalDate.of(2026,5,3)));
            bookingRepo.save(booking("A. Mthembu","Durban","Ford Everest","+27841112233","a.mthembu@email.co.za","approved", LocalDate.of(2026,5,5)));
            bookingRepo.save(booking("J. Naidoo","Pretoria","Honda Civic","+27852223344","j.naidoo@email.co.za","completed", LocalDate.of(2026,4,28)));
            bookingRepo.save(booking("M. Molefe","Gqeberha","Audi A4","+27863334455","m.molefe@email.co.za","pending_approval", LocalDate.of(2026,5,8)));
        }

        if (driverRepo.count() == 0) {
            driverRepo.save(driver("S. Dlamini","s.dlamini@email.co.za","+27871112233","Johannesburg","pending"));
            driverRepo.save(driver("R. Van Wyk","r.vanwyk@email.co.za","+27872223344","Cape Town","pending"));
            driverRepo.save(driver("N. Mokoena","n.mokoena@email.co.za","+27873334455","Durban","approved"));
        }

        if (ticketRepo.count() == 0) {
            ticketRepo.save(ticket("P. Khosa","Booking modification request","p.khosa@email.co.za","open"));
            ticketRepo.save(ticket("L. Smith","Payment query - double charge","l.smith@email.co.za","open"));
            ticketRepo.save(ticket("Y. Jacobs","Vehicle return extension","y.jacobs@email.co.za","resolved"));
        }
    }

    private Car car(String n, String c, int r, String s, String i, String d) {
        Car car = new Car(); car.setName(n); car.setCategory(c);
        car.setDailyRate(BigDecimal.valueOf(r)); car.setStatus(s);
        car.setImage(i); car.setDescription(d); return car;
    }
    private Booking booking(String n, String city, String cn, String p, String e, String s, LocalDate d) {
        Booking b = new Booking(); b.setCustomerName(n); b.setCity(city); b.setCarName(cn);
        b.setPhone(p); b.setEmail(e); b.setStatus(s); b.setCheckoutDate(d);
        b.setCreatedAt(LocalDateTime.now()); return b;
    }
    private DriverApplication driver(String n, String e, String p, String c, String s) {
        DriverApplication d = new DriverApplication(); d.setApplicantName(n);
        d.setEmail(e); d.setPhone(p); d.setCity(c); d.setStatus(s);
        d.setSubmittedAt(LocalDateTime.now()); return d;
    }
    private SupportTicket ticket(String n, String sub, String e, String s) {
        SupportTicket t = new SupportTicket(); t.setCustomerName(n);
        t.setSubject(sub); t.setEmail(e); t.setStatus(s);
        t.setCreatedAt(LocalDateTime.now()); return t;
    }
    private static String img(String n, String bg, String ac) {
        return "https://placehold.co/600x400/"+bg+"/"+ac+"?text="+n+"&font=raleway";
    }
}

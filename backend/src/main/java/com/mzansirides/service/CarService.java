package com.mzansirides.service;

import com.mzansirides.model.Car;
import com.mzansirides.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> getAllCars() {
        return carRepository.findAllSorted();
    }

    public List<Car> getCarsByCategory(String category) {
        return carRepository.findByCategorySorted(category);
    }

    public List<Car> getAvailableCars() {
        return carRepository.findByStatus("available");
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
    }

    public Car createCar(Car car) {
        if (car.getStatus() == null) car.setStatus("available");
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car updated) {
        Car car = getCarById(id);
        if (updated.getName() != null) car.setName(updated.getName());
        if (updated.getCategory() != null) car.setCategory(updated.getCategory());
        if (updated.getDailyRate() != null) car.setDailyRate(updated.getDailyRate());
        if (updated.getStatus() != null) car.setStatus(updated.getStatus());
        if (updated.getImage() != null) car.setImage(updated.getImage());
        if (updated.getDescription() != null) car.setDescription(updated.getDescription());
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }
}

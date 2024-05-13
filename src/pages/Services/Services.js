import React from "react";
import "./Services.module.css";

const servicesData = [
  {
    id: "surgery",
    title: "Surgery",
    description:
      "Planned, urgent and emergency operations for animals of any complexity.",
    numServices: "78",
  },
  {
    id: "therapy",
    title: "Therapy",
    description:
      "Systematic actions for the treatment and prevention of diseases.",
    numServices: "124",
  },
  {
    id: "cardiology",
    title: "Cardiology",
    description: "Taking care of your pet's cardiovascular system.",
    numServices: "22",
  },
  {
    id: "diagnostics",
    title: "Diagnostics",
    description: "Diagnosis of pets is the basis of successful treatment.",
    numServices: "96",
  },
];

const ServiceCard = ({ title, description, numServices }) => {
  return (
    <div className="service-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <span>{numServices} services</span>
      <button>Read more</button>
    </div>
  );
};

const Services = () => {
  return (
    <div className="services-section">
      <h1>Our services</h1>
      <div className="services-grid">
        {servicesData.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            numServices={service.numServices}
          />
        ))}
      </div>
      <div className="appointment-section">
        <h2>Make an appointment</h2>
        <p>
          A wide range of veterinary services and specialists around the clock.
        </p>
        <button>Book now</button>
      </div>
    </div>
  );
};

export default Services;

import React, { useState, useEffect } from 'react';
import CountriesData from "../CountriesData";
import CountriesListShimmer from "./CountriesListShimmer";
import CountryCard from "./CountryCard";

export default function CountriesList({ query }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading time
    setLoading(true);
    setTimeout(() => {
      setCountries(CountriesData);
      setLoading(false);
    }, 2000); // 2 seconds delay to show shimmer effect
  }, []);

  if (loading) {
    return <CountriesListShimmer />;
  }

  const array = countries
    .filter((country) =>
      country.name.common.toLowerCase().includes(query) || country.region.toLowerCase().includes(query)
    )
    .map((country) => (
      <CountryCard
        key={country.name.common}
        name={country.name.common}
        flag={country.flags.svg}
        population={country.population.toLocaleString("en-IN")}
        region={country.region}
        capital={country.capital?.[0]}
      />
    ));

  return (
    <div className="countries-container">
      {array.length > 0 ? array : <p>No countries found matching your search.</p>}
    </div>
  );
}

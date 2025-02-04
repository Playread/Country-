import React, { useEffect, useState } from "react";

import "./CountryDetail.css";
import { Link, useParams, useNavigate } from "react-router-dom";

import { useTheme } from "../hooks/useTheme";

export default function CountryDetail() {
  const [isDark] = useTheme()
    const params = useParams();
  const countryName = params.country;
  const navigate = useNavigate();

  const [countryData, setCountryData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Country not found");
        }
        return res.json();
      })
      .then(([data]) => {
        setCountryData({
          name: data.name.common,
          nativeName:
            Object.values(data.name.nativeName || {})[0]?.common,
          population: data.population,
          region: data.region,
          subregion: data.subregion,
          capital: data.capital || [],
          flag: data.flags.svg,
          tld: data.tld,
          languages: Object.values(data.languages || {}).join(", "),
          currencies: Object.values(data.currencies || {})
            .map((currency) => currency.name)
            .join(", "),
          borders: [],
        });

        // Handle borders
        const borders = data.borders || [];
        Promise.all(
          borders.map((border) =>
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
              .then((res) => res.json())
              .then(([borderCountry]) => borderCountry.name.common)
          )
        )
          .then((borderNames) => {
            setCountryData((prevState) => ({
              ...prevState,
              borders: borderNames,
            }));
          })
          .catch((err) => {
            console.error("Error fetching border countries:", err);
            setCountryData((prevState) => ({ ...prevState, borders: [] }));
          });
      })
      .catch((err) => {
        console.error("Error fetching country data:", err);
        setNotFound(true);
      });
  }, [countryName]);

  if (notFound) {
    return <div>Country Not Found</div>;
  }

  return countryData === null ? (
    "loading..."
  ) : (
    <main className={`${isDark ? "dark" : ""}`}>
     
      <div className="country-details-container">
        <span
          className="back-button"
          onClick={() => {
            navigate(-1);
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>
        <div className="country-details">
          <img src={countryData.flag} alt={`${countryData.name} flag`} />
          <div className="details-text-container">
            <h1>{countryData.name}</h1>
            <div className="details-text">
              <p>
                <b>Native Name: {countryData.nativeName || countryData.name}</b>
                <span className="native-name"></span>
              </p>
              <p>
                <b>
                  Population: {countryData.population.toLocaleString("en-IN")}
                </b>
                <span className="population"></span>
              </p>
              <p>
                <b>Region: {countryData.region}</b>
                <span className="region"></span>
              </p>
              <p>
                <b>Sub Region: {countryData.subregion} </b>
                <span className="sub-region"></span>
              </p>
              <p>
                <b>Capital: {countryData.capital?.join(" ")}</b>
                <span className="capital"></span>
              </p>
              <p>
                <b>Top Level Domain: {countryData.tld}</b>
                <span className="top-level-domain"></span>
              </p>
              <p>
                <b>Currencies: {countryData.currencies}</b>
                <span className="currencies"></span>
              </p>
              <p>
                <b>Languages: {countryData.languages}</b>
                <span className="languages"></span>
              </p>
            </div>
            {countryData.borders.length !== 0 && (
              <div className="border-countries">
                <b>Border Countries: </b>&nbsp;
                {countryData.borders.map((border) => (
                  <Link key={border} to={`/${border}`}>
                    {border}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

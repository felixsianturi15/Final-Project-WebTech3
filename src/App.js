import React, { useState } from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";

import axios from "axios";
import { FaHeart } from "react-icons/fa";
import moment from "moment";
import _ from "lodash";
import styled from "styled-components";
import "./App.css";


class SearchButton extends React.Component {
  render() {
    return <button onClick={this.props.onClick}>🔍 Cari Makanan</button>;
  }
}

class ToggleButton extends React.Component {
  render() {
    const { onClick, show } = this.props;
    return <button onClick={onClick}>{show ? "Sembunyikan Rekomendasi" : "Tampilkan Rekomendasi"}</button>;
  }
}

class SubmitButton extends React.Component {
  render() {
    return <button type="submit">{this.props.children}</button>;
  }
}


class LifecycleDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: moment().format("HH:mm:ss") };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ time: moment().format("HH:mm:ss") });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="lifecycle-box">
        <p>Waktu:</p>
        <strong>{this.state.time}</strong>
      </div>
    );
  }
}


class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar">
        <h2 className="logo">Healthy Calories</h2>
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/feedback">Feedback</NavLink>
          <NavLink to="/suggest">Suggest</NavLink>
        </div>
        <LifecycleDemo />
      </nav>
    );
  }
}


const StyledTitle = styled.h1`
  color: #0b6245;
  text-align: center;
  margin-bottom: 20px;
`;


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      mealType: "",
      recipes: [],
      recommendations: [],
      loading: false,
      error: null,
    };

    this.API_KEY = "668ea93d76a54fe9bd9209719f96e791";
  }

  fetchRecommendations = async () => {
    try {
      const { data } = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?type=dessert&number=3&addRecipeNutrition=true&apiKey=${this.API_KEY}`
      );
      this.setState({ recommendations: data.results || [] });
    } catch (error) {
      console.error("Gagal ambil rekomendasi", error);
    }
  };

  handleSearch = async () => {
    if (!this.state.search.trim()) {
      alert("Masukkan kata kunci!");
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const { data } = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${this.state.search}&type=${this.state.mealType}&number=6&addRecipeNutrition=true&apiKey=${this.API_KEY}`
      );

      const sorted = _.sortBy(
        data.results || [],
        (r) => r.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount || 0
      );

      this.setState({ recipes: sorted });
      this.fetchRecommendations();
    } catch {
      this.setState({ error: "Gagal mengambil data!" });
    } finally {
      this.setState({ loading: false });
    }
  };

  renderCard = (r) => {
    const getNutrient = (name) =>
      r.nutrition?.nutrients?.find((n) => n.name === name)?.amount ?? "-";

    return (
      <div key={r.id} className="recipe-card">
        <img src={r.image} alt={r.title} />
        <div className="recipe-content">
          <h2>{r.title}</h2>
          <FaHeart />
          <p>🔥 {getNutrient("Calories")} kcal</p>
          <p>💪 Protein: {getNutrient("Protein")} g</p>
          <p>🧈 Lemak: {getNutrient("Fat")} g</p>
          <p>🍞 Karbo: {getNutrient("Carbohydrates")} g</p>
          <small>{moment().format("DD MMM YYYY HH:mm")}</small>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="app-container">
        <StyledTitle>🥗 Healthy Calories Finder</StyledTitle>

        <div className="search-box">
          <input
            placeholder="Cari makanan..."
            onChange={(e) => this.setState({ search: e.target.value })}
          />
          <select onChange={(e) => this.setState({ mealType: e.target.value })}>
            <option value="">Semua</option>
            <option value="main course">Main Course</option>
            <option value="dessert">Dessert</option>
          </select>
          <SearchButton onClick={this.handleSearch} />
        </div>

        {this.state.loading && <p className="loading">Loading...</p>}
        {this.state.error && <p>{this.state.error}</p>}

        <div className="recipe-grid">{this.state.recipes.map(this.renderCard)}</div>

        {this.props.showRecommendation && (
          <>
            <h3 style={{ marginTop: "40px", fontWeight: "800" }}>✨ Rekomendasi Dessert</h3>
            <div className="recipe-grid">{this.state.recommendations.map(this.renderCard)}</div>
          </>
        )}
      </div>
    );
  }
}


const HomeWithToggleFunctional = () => {
  const [show, setShow] = useState(true);

  return (
    <>
      <ToggleButton show={show} onClick={() => setShow(!show)} />
      <Home showRecommendation={show} />
    </>
  );
};


class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", message: "", response: "" };
  }

  submit = (e) => {
    e.preventDefault();
    this.setState({ response: "✅ Feedback terkirim!", name: "", message: "" });
  };

  render() {
    return (
      <div className="feedback-section">
        <form onSubmit={this.submit}>
          <input
            placeholder="Nama"
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
          <textarea
            placeholder="Pesan"
            value={this.state.message}
            onChange={(e) => this.setState({ message: e.target.value })}
          />
          <SubmitButton>Kirim</SubmitButton>
          <p>{this.state.response}</p>
        </form>
      </div>
    );
  }
}


class Suggest extends React.Component {
  constructor(props) {
    super(props);
    this.suggestionRef = React.createRef();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const val = this.suggestionRef.current.value.trim();
    if (!val) return alert("Masukkan rekomendasi!");
    alert(`🍳 Terima kasih! "${val}" telah dikirim.`);
    this.suggestionRef.current.value = "";
  };

  render() {
    return (
      <div className="suggestion-section">
        <h2>📌 Rekomendasi Menu</h2>
        <form onSubmit={this.handleSubmit}>
          <input ref={this.suggestionRef} />
          <SubmitButton>Kirim Rekomendasi</SubmitButton>
        </form>
      </div>
    );
  }
}


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeWithToggleFunctional />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/suggest" element={<Suggest />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

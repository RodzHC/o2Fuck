import $ from "jquery";
import InputCustomizado from "../componentes/InputCustomizado";
import React, { Component } from "react";
import PubSub from "pubsub-js";
import TabelaDiretores from "../componentes/TabelaDiretores";

const apiBaseUrl = "/";
class FormularioDiretores extends Component {
  constructor() {
    super();
    this.state = {
      diretorNome: "",
      diretorDataNascimento: "",
      Nacionalidadeionalidade: ""
    };

    this.setDiretorNome = this.setDiretorNome.bind(this);
    this.setDiretorDataNascimento = this.setDiretorDataNascimento.bind(this);
    this.setDiretorNacionalidade = this.setDiretorNacionalidade.bind(this);
    this.handleDiretoresSubmit = this.handleDiretoresSubmit.bind(this);
  }
  componentDidMount() {
    document.title = "O2Fix - Cadastro Diretores";
  }

  setDiretorNome(e) {
    this.setState({ diretorNome: e.target.value });
  }

  updateDirectors = list => {
    PubSub.publish("atualiza-lista-diretores", list);
    this.setState({
      diretorNome: "",
      diretorDataNascimento: "",
      diretorNacionalidade: ""
    });
  };

  setDiretorDataNascimento(e) {
    this.setState({ diretorDataNascimento: e.target.value });
  }

  setDiretorNacionalidade(e) {
    this.setState({ diretorNacionalidade: e.target.value });
  }

  handleDiretoresSubmit(e) {
    e.preventDefault();
    var diretorNome = this.state.diretorNome.trim();
    var diretorDataNascimento = this.state.diretorDataNascimento;
    var diretorNacionalidade = this.state.diretorNacionalidade;
    var update = this.updateDirectors;

    $.ajax({
      url: `${apiBaseUrl}api/diretores`,
      contentType: "application/json",
      dataType: "json",
      type: "POST",
      data: JSON.stringify({
        diretorNome: diretorNome,
        diretorDataNascimento: diretorDataNascimento,
        diretorNacionalidade: diretorNacionalidade
      }),
      success: update,
      error: function(resposta) {
        if (resposta.status === 400) {
        }
      },
      beforeSend: function() {
        PubSub.publish("limpa-erros", {});
      }
    });

    this.setState({
      diretorNome: "",
      diretorDataNascimento: "",
      diretorNacionalidade: ""
    });
  }

  render() {
    var myObject = this.props.nacionalidade;

    function Varredor(obj) {
      var ar = [];

      for (var key in obj) {
        ar.push(
          <option key={obj[key]._id} value={obj[key].name}>
            {obj[key].name}
          </option>
        );
      }
      return ar;
    }

    var meuPiru = Varredor(myObject);

    return (
      <div className="autorForm">
        <form onSubmit={this.handleDiretoresSubmit}>
          <fieldset>
            <InputCustomizado
              id="diretorNome"
              name="diretorNome"
              label="Nome do diretor: "
              type="text"
              value={this.state.diretorNome}
              placeholder="Nome do diretor"
              onChange={this.setDiretorNome}
            />
            <InputCustomizado
              placeholder=""
              id="diretorDataNascimento"
              name="diretorDataNascimento"
              label="Data de nascimento: "
              type="date"
              value={this.state.diretorDataNascimento}
              onChange={this.setDiretorDataNascimento}
            />

            <div className="form-group">
              <label htmlFor="imput-select">Nacionalidade</label>
              <select
                id="imput-select"
                className="form-control"
                value={this.state.diretorNacionalidade}
                name="diretorNacionalidade"
                onChange={this.setDiretorNacionalidade}
              >
                <option disabled value>
                  Selecione
                </option>
                {meuPiru}
              </select>
            </div>

            <label />
            <button type="submit" className="btn btn-primary">
              Gravar
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default class DiretoresAdmin extends Component {
  constructor() {
    super();
    this.state = { diretores: [], nacionalidade: [] };
  }

  componentDidMount() {
    $.ajax({
      url: `${apiBaseUrl}api/diretores`,
      dataType: "json",
      success: function(lista) {
        this.setState({ diretores: lista });
      }.bind(this)
    });
    $.ajax({
      url: `${apiBaseUrl}api/cadastro/nacionalidade`,
      dataType: "json",
      success: function(lista) {
        this.setState({ nacionalidade: lista });
      }.bind(this)
    });

    PubSub.subscribe(
      "atualiza-lista-diretores",
      function(topicName, lista) {
        this.setState({ diretores: lista });
      }.bind(this)
    );
  }

  render() {
    return (
      <div>
        <div className={`${this.props.headerClass}`}>
          <h1>Cadastro de Diretores</h1>
        </div>
        <div className="content">
          <FormularioDiretores nacionalidade={this.state.nacionalidade} />
          <TabelaDiretores />
        </div>
      </div>
    );
  }
}

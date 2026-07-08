import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import apiClient from "../../api/api";

const MedicalRecordList = () => {
  const [prontuarios, setProntuarios] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const buscarDadosProntuario = async () => {
      try {
        const [prontuarioResponse, pacienteResponse] = await Promise.all([
          apiClient.get("/prontuario"),
          apiClient.get("/paciente"),
        ]);

        setProntuarios(prontuarioResponse.data);
        setPacientes(pacienteResponse.data);
      } catch (error) {
        console.error("Erro ao obter dados dos prontuários:", error);
      }
    };

    buscarDadosProntuario();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const prontuariosFiltrados = prontuarios.filter((prontuario) => {
    const paciente = pacientes.find((item) => item.id === prontuario.paciente_id);
    const textoBusca = [
      prontuario.descricao,
      prontuario.id,
      prontuario.paciente_id,
      paciente?.nome,
      paciente?.email,
    ].join(" ").toLowerCase();

    return textoBusca.includes(searchTerm.toLowerCase());
  });

  const pacientesFiltrados = pacientes.filter((paciente) => {
    return (
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.id.toString().includes(searchTerm)
    );
  });

  return (
    <section className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Listagem de Prontuários
      </h2>

      {/* Campo de busca */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label htmlFor="search" className="text-gray-700 font-medium">
          Buscar prontuário ou paciente:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Digite o nome, email ou identificador"
          className="w-full sm:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
        />
      </div>

      <ul className="space-y-4">
        {prontuariosFiltrados.length > 0 ? (
          prontuariosFiltrados.map((prontuario) => {
            const paciente = pacientes.find((item) => item.id === prontuario.paciente_id);

            return (
              <li
                key={prontuario.id}
                className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-500">
                  <strong className="text-gray-700">Registro:</strong> {prontuario.id}
                </p>
                <p className="text-gray-700">
                  <strong>Descrição:</strong> {prontuario.descricao}
                </p>
                <p className="text-gray-700">
                  <strong>Paciente:</strong> {paciente?.nome || prontuario.paciente_id}
                </p>
                <Link
                  to={`/paciente/${prontuario.paciente_id}`}
                  className="inline-block mt-2 text-cyan-700 font-semibold hover:underline"
                >
                  Ver detalhes
                </Link>
              </li>
            );
          })
        ) : pacientesFiltrados.length > 0 ? (
          pacientesFiltrados.map((paciente) => (
              <li
                key={paciente.id}
                className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-500">
                  <strong className="text-gray-700">Registro:</strong> {paciente.id}
                </p>
                <p className="text-gray-700">
                  <strong>Paciente:</strong> {paciente.nome}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {paciente.email}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Nenhum prontuário cadastrado para exibir nesta lista.
                </p>
                <Link
                  to={`/paciente/${paciente.id}`}
                  className="inline-block mt-2 text-cyan-700 font-semibold hover:underline"
                >
                  Ver detalhes
                </Link>
              </li>
          ))
        ) : (
          <p className="text-gray-600">Nenhum prontuário ou paciente encontrado.</p>
        )}
      </ul>
    </section>
  );
};

export default MedicalRecordList;

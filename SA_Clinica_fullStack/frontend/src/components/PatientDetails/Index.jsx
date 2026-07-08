import { useState, useEffect } from 'react'
import apiClient from '../../api/api'

import { useParams } from 'react-router'

import { toast } from 'react-toastify'


const PatientDetails = () => {

    const { id } = useParams()
    const [patient, setPatient] = useState({})
    const [consults, setConsults] = useState([])
    const [exams, setExams] = useState([])

    //as

    const [editing, setEditing] = useState(null)
    const [editData, setEditData] = useState({
        reason: "",
        date: "",
        time: "",
        description: "",
        medication: "",
        dosagePrecautions: "",
    })
    const [isEditing, setIsEditing] = useState(false)

    //exams

    const [editingExam, setEditingExam] = useState(null)
    const [editExamData, setEditExamData] = useState({
        name: "",
        date: "",
        time: "",
        type: "",
        laboratory: "",
        documentUrl: "",
        results: "",
    })
    const [isEditingExam, setIsEditingExam] = useState(false)


    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientRes = await apiClient.get(`/paciente/${id}`)
                const consultsRes = await apiClient.get('/consulta')
                const examsRes = await apiClient.get('/exames')

                setPatient(patientRes.data)
                setConsults(consultsRes.data.filter((consult) => consult.paciente_id === Number(id)))
                setExams(examsRes.data.filter((exam) => exam.paciente_id === Number(id)))
            } catch (error) {
                console.error("Erro ao obter os detalhes do paciente", error)
            }
        }
        fetchPatientDetails()
    }, [id])


    return (
        <div>
            <h2 className='text-xl font-bold text-cyan-800 mb-4'>{patient.nome}</h2>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Telefone:</strong> {patient.telefone}</p>
            <p><strong>Responsável:</strong> {patient.responsavel || "-"}</p>

            <h3 className='text-lg font-bold text-cyan-800 mt-6 mb-2'>Consultas</h3>
            {consults.length ? (
                <ul>
                    {consults.map((consult) => (
                        <li key={consult.id}>
                            {consult.motivo} - {consult.data_consulta}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma consulta encontrada.</p>
            )}

            <h3 className='text-lg font-bold text-cyan-800 mt-6 mb-2'>Exames</h3>
            {exams.length ? (
                <ul>
                    {exams.map((exam) => (
                        <li key={exam.id}>
                            {exam.tipo_exame} - {exam.resultado}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhum exame encontrado.</p>
            )}
        </div>
    )
}

export default PatientDetails

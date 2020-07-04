import React, { useState, useEffect, FormEvent } from 'react';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Respositories, Error } from './styles';
import { FiChevronRight } from 'react-icons/fi'; //icone
import {Link} from 'react-router-dom'
import api from '../../services/api';


interface Repository { //OBS: SÓ RETORNA O QUE VOU UTILIZAR
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    //VÃO SER EXIBIDOS EM TELA.
    const [newRepo, setNewRepo] = useState(''); //PEGANDO VALOR NO INPUT DIGITADO PELO USUÁRIO
    const [inputError, setInputError] = useState('');
    const [repositores, setRepositores] = useState<Repository[]>(()=>{
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositores');

        if(storagedRepositories){
            return JSON.parse(storagedRepositories); 
        }else{
            return [];
        }
    }); // ARMAZENAMENTO REPOSITORIOS

   

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositores', JSON.stringify(repositores))
    }, [repositores])

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();//BLOQUEANDO EVENTO PADRÃO

        if (!newRepo) {
            setInputError('Digite o autor/nome do repositório ');
            return;
        }

        try { //TRATATIVA DE ERRO

            const response = await api.get<Repository>(`repos/${newRepo}`); //UTILIZANDO VALUE DO INPUT
            const repository = response.data;
            setRepositores([...repositores, repository]); //ARMAZENANDO 
            setNewRepo(''); //LIMPADO O INPUT 
            setInputError(''); //LIMPANDO A MENSAGEM DE ERRO.

        } catch (err) { setInputError(' Erro na busca por esse repositório '); }
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository} > {/*EXECUTAR A FUNÇÃO AO ENVIAR O SUBMIT */}

                <input
                    placeholder="Digite o nome do repositório"
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}// evento de mudança
                />
                <button type="submit">Pesquisar</button>

            </Form>

            {inputError && <Error>{inputError}</Error>} {/* MOSTRANDO ERRO NA TELA */}

            <Respositories> {/* div */}

                {repositores.map(repository => ( //FAZENDO MAP COM TODOS REPOSITORIOS SALVOS.

                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>

                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />

                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight size={20} />
                    </Link>
                ))}

            </Respositories>
        </>
    )
}

export default Dashboard;
import { Button } from "../components/Button";
import logoImg from "../pages/assets/images/logo.svg";
import checkImg from "../pages/assets/images/check.svg";
import answerImg from "../pages/assets/images/answer.svg";

import "../styles/room.scss";
import { RoomCode } from "../components/RoomCode";
import { database } from "../services/firebase";
import { Question } from "../components/Question";
import { useParams } from "react-router";
import { useRoom } from "../hooks/useRoom";
import deleteImg from "../pages/assets/images/delete.svg";
import { useHistory } from "react-router-dom";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);
  const history = useHistory();

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true,
    });
  }

  async function handleDeleteQuestionId(questionId: string) {
    if (window.confirm("você tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  // ?async function handleSendQuestion(event: FormEvent) {
  //   event.preventDefault();
  //   if (newQuestion.trim() === "") {
  //     return;
  //   }
  //   if (!user) {
  //     throw new Error("You must be logged in");
  //   }

  //   const question = {
  //     content: newQuestion,
  //     author: {
  //       name: user.name,
  //       avatar: user.avatar,
  //     },
  //     isHighLighted: false,
  //     isAnswered: false,
  //   };
  //   // envio dos dasdos das questoes ao bando de dados
  //   await database.ref(`rooms/${roomId}/questions`).push(question);

  //   setNewQuestion("");
  // }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala{" "}
            </Button>
          </div>
        </div>
      </header>

      <main className="">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighLightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="dar destaque a pergunta" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteQuestionId(question.id)}
                >
                  <img src={deleteImg} alt="remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}

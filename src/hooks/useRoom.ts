import { useState, useEffect } from "react";
import {database} from "../services/firebase"
import { useAuth } from "./useAuth";

type Questions = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };

  content: string;
  isHighLighted: boolean;
  isAnswered: boolean;
  likeCount:number;
  likedId:string | undefined;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };

    content: string;
    isHighLighted: boolean;
    isAnswered: boolean;
    likes:Record<string, {
      authorId:string
    }>
  }
>;


export function useRoom (roomId:string){
  const { user} = useAuth()
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      // converte os dados retornados como objeto em uma array de chave e valor
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighLighted: value.isHighLighted,
            isAnswered: value.isAnswered,
            likeCount:Object.values(value.likes ??{}).length,
            likedId:Object.entries(value.likes ??{}).find(([key,like])=>like.authorId === user?.id)?.[0]
          };
        }
      );
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      console.log(room.val());
      console.log(parsedQuestions);
      
    });
    //return roomRef.off("value")
  }, [roomId, user?.id]);

  return {questions, title}
}
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()
client = AsyncIOMotorClient("mongodb://db:27017/app")
db = client["app"]


@app.get("/stats/{survey_id}")
async def get_survey_stats(survey_id: str):

    survey = await db.surveys.find_one({"_id": ObjectId(survey_id)})
    if not survey:
        return {"error": f"Encuesta no encontrada {survey_id}"}

    # Inicializar stats para cada pregunta de opción múltiple
    question_stats = []
    for i, question in enumerate(survey["questions"]):
        if question["type"] == "multiple-choice":
            option_counts = {opt: 0 for opt in question.get("options", [])}
            question_stats.append(option_counts)
        else:
            question_stats.append(None)  # Para otro tipo de preguntas

    total_responses = 0
    avg_time_acc = 0
    avg_time_count = 0

    # Usar cursor y procesar respuesta por respuesta
    cursor = db.surveyresponses.find({"surveyId": ObjectId(survey_id)})
    async for r in cursor:
        total_responses += 1

        # Procesar tiempo de respuesta
        if "responseTimeMs" in r:
            avg_time_acc += r["responseTimeMs"]
            avg_time_count += 1

        for ans in r.get("answers", []):
            idx = ans.get("questionIndex")
            if idx is not None and 0 <= idx < len(survey["questions"]):
                question = survey["questions"][idx]
                if question["type"] == "multiple-choice":
                    # Puede ser string (una opción) o array (varias opciones)
                    if isinstance(ans["answer"], list):
                        for v in ans["answer"]:
                            if v in question_stats[idx]:
                                question_stats[idx][v] += 1
                    else:
                        if ans["answer"] in question_stats[idx]:
                            question_stats[idx][ans["answer"]] += 1
                # Aquí puedes añadir stats para otros tipos

    # Armar resultado para cada pregunta
    questions_result = []
    for i, question in enumerate(survey["questions"]):
        if question["type"] == "multiple-choice":
            counts = question_stats[i]
            percentages = {
                opt: (count / total_responses * 100 if total_responses else 0)
                for opt, count in counts.items()
            }
            questions_result.append(
                {
                    "question": question["text"],
                    "type": question["type"],
                    "options": counts,
                    "percentages": percentages,
                }
            )
        else:
            # Si quieres contar respuestas para texto, puedes hacerlo igual que antes
            questions_result.append(
                {
                    "question": question["text"],
                    "type": question["type"],
                    "info": "No se calcularon estadísticas para este tipo",
                }
            )

    avg_time = (avg_time_acc / avg_time_count) if avg_time_count else None

    return {
        "survey": {
            "title": survey["title"],
            "description": survey.get("description", ""),
        },
        "total_responses": total_responses,
        "questions": questions_result,
        "avg_response_time_ms": avg_time,
    }

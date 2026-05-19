import { Link } from "react-router-dom";
import { FaGift } from "react-icons/fa";
import { LuTags, LuTicket } from "react-icons/lu";
import styles from "./QuickAccess.module.scss";

const items = [
    {
        title: "Ofertas",
        text: "Las mejores ofertas actualizadas a diario. No te pierdas nada.",
        link: "/ofertas",
        cta: "Ver ofertas",
        variant: "orange",
        icon: <LuTags />,
    },
    {
        title: "Sorteos",
        text: "Participá en los sorteos activos y ganá premios increíbles.",
        link: "/sorteos",
        cta: "Ir al sorteo",
        variant: "purple",
        icon: <FaGift />,
    },
    {
        title: "Canjear código",
        text: "¿Tenés un código? Canjealo y sumá más participaciones.",
        link: "/codigo",
        cta: "Canjear ahora",
        variant: "green",
        icon: <LuTicket />,
    },
];

export default function QuickAccess() {
    return (
        <section className={styles.section}>
            <div className="container">
                {/* <h2>⚡ Accesos rápidos</h2> */}

                <div className="row g-4">
                    {items.map((item) => (
                        <div className="col-12 col-md-6 col-lg-4" key={item.title}>
                            <article className={`${styles.card} ${styles[item.variant]}`}>
                                <div className={styles.icon}>{item.icon}</div>

                                <h3>{item.title}</h3>
                                <p>{item.text}</p>

                                <Link to={item.link}>{item.cta} →</Link>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
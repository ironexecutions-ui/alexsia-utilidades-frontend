import "./logoutmodal.css";

export default function LogoutModal({ fechar, confirmar }) {
    return (
        <div className="logout-overlay">
            <div className="logout-container">
                <h2>Deseja realmente sair?</h2>

                <div className="logout-buttons">
                    <button className="confirmar" onClick={confirmar}>Sim, sair</button>
                    <button className="cancelar" onClick={fechar}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}

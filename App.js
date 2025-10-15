import { useState, useEffect } from "react";

function App() {
  const VERSION = "v1.0.2";
  const savedItems = JSON.parse(localStorage.getItem("items")) || [];
  const [items, setItems] = useState(savedItems);
  const [input, setInput] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  );

  // ✅ 항목 추가
  const addItem = () => {
    if (input.trim() === "") return;
    const newList = [...items, { name: input, checked: false, id: Date.now() }];
    setItems(newList);
    localStorage.setItem("items", JSON.stringify(newList));
    setInput("");
    setLastUpdated(
      new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    );
  };

  // ✅ 체크/삭제 토글
  const toggleCheck = (index) => {
    if (deleteMode) {
      const newSelected = [...selected];
      if (newSelected.includes(index)) {
        setSelected(newSelected.filter((i) => i !== index));
      } else {
        newSelected.push(index);
        setSelected(newSelected);
      }
    } else {
      const updatedList = items.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      );
      setItems(updatedList);
      localStorage.setItem("items", JSON.stringify(updatedList));
    }
  };

  // ✅ 선택 삭제
  const deleteSelected = () => {
    const updatedList = items.filter((_, index) => !selected.includes(index));
    setItems(updatedList);
    localStorage.setItem("items", JSON.stringify(updatedList));
    setSelected([]);
    setDeleteMode(false);
  };

  // ✅ 전체 삭제
  const deleteAll = () => {
    if (window.confirm("정말 전체 삭제하시겠어요?")) {
      setItems([]);
      localStorage.removeItem("items");
      setSelected([]);
      setDeleteMode(false);
    }
  };

  // ✅ 자동 저장
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // ✅ fade-in 애니메이션
  useEffect(() => {
    const lastItem = document.querySelector(".fade-in:last-child");
    if (lastItem) {
      lastItem.style.opacity = "0";
      setTimeout(() => {
        lastItem.style.transition = "opacity 0.6s ease";
        lastItem.style.opacity = "1";
      }, 100);
    }
  }, [items]);

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "linear-gradient(120deg, #fff8e7, #fefcf8, #fff0db)",
        backgroundSize: "300% 300%",
        animation: "bgMove 8s ease infinite",
        padding: "40px 24px 60px",
        fontFamily: "'Gowun Dodum', 'Noto Sans KR', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🌈 배경 애니메이션 keyframes 정의 */}
      <style>{`
        @keyframes bgMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes buttonPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .fade-in { transition: opacity 0.5s ease; }
      `}</style>

      {/* 왼쪽 상단 버전 */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "16px",
          fontSize: "12px",
          color: "#aaa",
        }}
      >
        {VERSION}
      </div>

      {/* 오른쪽 상단 업데이트 버튼 */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "16px",
        }}
      >
        <button
          onClick={() => setShowUpdate(true)}
          style={{
            backgroundColor: "#ffd479",
            border: "none",
            borderRadius: "8px",
            padding: "6px 10px",
            fontSize: "13px",
            color: "#4b3b0a",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "transform 0.15s ease",
          }}
          onMouseDown={(e) => (e.target.style.animation = "buttonPress 0.2s")}
        >
          업데이트
        </button>
      </div>

      {/* 헤더 */}
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "600",
            color: "#3b3a3a",
            marginBottom: "6px",
          }}
        >
          🌿 여행의 조각
        </h1>
        <p style={{ color: "#7d7b7b", fontSize: "15px" }}>
          떠나기 전, 마음을 가볍게 정리해보세요.
        </p>
      </header>

      {/* 입력창 */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="가져갈 준비물을 적어보세요 ✏️"
          style={{
            flex: "1",
            padding: "12px 14px",
            fontSize: "15px",
            borderRadius: "10px",
            border: "1px solid #e0dcd3",
            backgroundColor: "#fffdf8",
            outline: "none",
          }}
        />
        <button
          onClick={addItem}
          style={{
            padding: "12px 16px",
            fontSize: "15px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #ffd479 0%, #ffb347 100%)",
            color: "#4b3b0a",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
            transition: "transform 0.1s ease",
          }}
          onMouseDown={(e) => (e.target.style.animation = "buttonPress 0.2s")}
        >
          추가
        </button>
      </div>

      {/* 리스트 */}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {items.map((item, index) => (
          <li
            className="fade-in"
            key={item.id}
            style={{
              backgroundColor: "white",
              padding: "12px 14px",
              marginBottom: "10px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 5px rgba(0,0,0,0.07)",
              opacity: "1",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={
                  deleteMode
                    ? selected.includes(index)
                    : item.checked || false
                }
                onChange={() => toggleCheck(index)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: deleteMode ? "#ff6b6b" : "#2b8eff",
                }}
              />
              <span
                style={{
                  fontSize: "16px",
                  color: item.checked ? "#aaa" : "#403d39",
                  textDecoration: item.checked ? "line-through" : "none",
                }}
              >
                {item.name}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {/* 하단 버튼 */}
      {items.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {!deleteMode ? (
            <>
              <button
                onClick={() => setDeleteMode(true)}
                style={{
                  backgroundColor: "#ff9b6b",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onMouseDown={(e) =>
                  (e.target.style.animation = "buttonPress 0.2s")
                }
              >
                삭제 모드
              </button>
              <button
                onClick={deleteAll}
                style={{
                  backgroundColor: "#ff5c5c",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onMouseDown={(e) =>
                  (e.target.style.animation = "buttonPress 0.2s")
                }
              >
                전체 삭제
              </button>
            </>
          ) : (
            <>
              <button
                onClick={deleteSelected}
                style={{
                  backgroundColor: "#2b8eff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onMouseDown={(e) =>
                  (e.target.style.animation = "buttonPress 0.2s")
                }
              >
                선택 삭제
              </button>
              <button
                onClick={() => {
                  setDeleteMode(false);
                  setSelected([]);
                }}
                style={{
                  backgroundColor: "#aaa",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onMouseDown={(e) =>
                  (e.target.style.animation = "buttonPress 0.2s")
                }
              >
                취소
              </button>
            </>
          )}
        </div>
      )}

      {/* 마지막 수정일 */}
      <p
        style={{
          textAlign: "center",
          color: "#b1ada8",
          fontSize: "13px",
          marginTop: "24px",
        }}
      >
        마지막 수정일: {lastUpdated}
      </p>

      <footer
        style={{
          textAlign: "center",
          color: "#b8b5b1",
          fontSize: "13px",
          marginTop: "10px",
        }}
      >
        made.by 현민
      </footer>

      {/* ✅ 업데이트 팝업 */}
      {showUpdate && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              width: "90%",
              maxWidth: "380px",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              maxHeight: "70vh",
              overflowY: "auto", // ✅ 스크롤 추가
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#333",
                marginBottom: "12px",
              }}
            >
              업데이트 내역
            </h2>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9f9f9" }}>
                  <th
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "8px",
                      fontSize: "14px",
                    }}
                  >
                    버전
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "8px",
                      fontSize: "14px",
                    }}
                  >
                    변경 내용
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      textAlign: "center",
                      fontSize: "13px",
                      color: "#555",
                    }}
                  >
                    v1.0.2
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      fontSize: "13px",
                      color: "#555",
                      lineHeight: "1.5",
                      padding: "8px",
                    }}
                  >
                    • 배경에 부드러운 그래픽 애니메이션 추가<br />
                    • 버튼 클릭 시 자연스러운 인터랙션<br />
                    • 업데이트 내역 스크롤 지원<br />
                    • “다음 예정 기능” 섹션 제거
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      textAlign: "center",
                      fontSize: "13px",
                      color: "#555",
                    }}
                  >
                    v1.0.1
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      fontSize: "13px",
                      color: "#555",
                      lineHeight: "1.5",
                      padding: "8px",
                    }}
                  >
                    • 항목 추가 시 부드러운 애니메이션<br />
                    • 감성 폰트 “Gowun Dodum” 적용<br />
                    • “마지막 수정일” 자동 표시
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "center",
                      fontSize: "13px",
                      color: "#555",
                    }}
                  >
                    v1.0.0
                  </td>
                  <td
                    style={{
                      fontSize: "13px",
                      color: "#555",
                      lineHeight: "1.5",
                      padding: "8px",
                    }}
                  >
                    • 체크박스 기반으로 변경<br />
                    • 삭제 모드 / 전체 삭제 기능 추가<br />
                    • 감성 UI 디자인 적용<br />
                    • 버전 및 업데이트 팝업 추가
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <button
                onClick={() => setShowUpdate(false)}
                style={{
                  backgroundColor: "#2b8eff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onMouseDown={(e) =>
                  (e.target.style.animation = "buttonPress 0.2s")
                }
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

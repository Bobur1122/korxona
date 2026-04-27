const fs = require('fs');
const filePath = 'c:/Users/User/OneDrive/Desktop/New folder (7)/frontend/src/pages/ProductDetailPage.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const lightbox = [
'',
'      {/* LIGHTBOX */}',
'      {lightboxOpen && (',
'        <div',
'          style={{',
'            position: "fixed", inset: 0, zIndex: 9999,',
'            background: "rgba(0,0,0,0.92)",',
'            display: "flex", alignItems: "center", justifyContent: "center",',
'            cursor: "zoom-out",',
'          }}',
'          onClick={() => setLightboxOpen(false)}',
'        >',
'          <button',
'            onClick={() => setLightboxOpen(false)}',
'            style={{',
'              position: "absolute", top: 20, right: 20, zIndex: 10,',
'              width: 44, height: 44, borderRadius: 999,',
'              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",',
'              color: "#fff", cursor: "pointer",',
'              display: "flex", alignItems: "center", justifyContent: "center",',
'              backdropFilter: "blur(8px)",',
'            }}',
'          >',
'            <X size={20} />',
'          </button>',
'',
'          {images.length > 1 && (',
'            <>',
'              <button',
'                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + images.length) % images.length); }}',
'                style={{',
'                  position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10,',
'                  width: 48, height: 48, borderRadius: 999,',
'                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",',
'                  color: "#fff", cursor: "pointer",',
'                  display: "flex", alignItems: "center", justifyContent: "center",',
'                }}',
'              >',
'                <ChevronLeft size={22} />',
'              </button>',
'              <button',
'                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % images.length); }}',
'                style={{',
'                  position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10,',
'                  width: 48, height: 48, borderRadius: 999,',
'                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",',
'                  color: "#fff", cursor: "pointer",',
'                  display: "flex", alignItems: "center", justifyContent: "center",',
'                }}',
'              >',
'                <ChevronRight size={22} />',
'              </button>',
'            </>',
'          )}',
'',
'          <img',
'            src={images[lightboxIndex] || mainImage}',
'            alt={productName}',
'            onClick={(e) => e.stopPropagation()}',
'            style={{',
'              maxWidth: "90vw", maxHeight: "85vh",',
'              objectFit: "contain", borderRadius: 12,',
'              cursor: "default",',
'              boxShadow: "0 10px 60px rgba(0,0,0,0.5)",',
'            }}',
'            onError={(e) => { e.target.src = getFallback(productName); e.target.onerror = null; }}',
'          />',
'',
'          {images.length > 1 && (',
'            <div style={{',
'              position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",',
'              padding: "8px 18px", borderRadius: 999,',
'              background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",',
'              color: "#fff", fontWeight: 700, fontSize: "0.85rem",',
'              border: "1px solid rgba(255,255,255,0.15)",',
'            }}>',
'              {lightboxIndex + 1} / {images.length}',
'            </div>',
'          )}',
'        </div>',
'      )}',
].join('\r\n');

// Find the pattern: </div>\r\n  );\r\n}\r\n at end of file
const endPattern = '    </div>\r\n  );\r\n}\r\n';
const idx = content.lastIndexOf(endPattern);
if (idx !== -1) {
  content = content.substring(0, idx) + lightbox + '\r\n    </div>\r\n  );\r\n}\r\n';
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('SUCCESS: Lightbox added');
} else {
  // Try LF
  const endLF = '    </div>\n  );\n}\n';
  const idx2 = content.lastIndexOf(endLF);
  if (idx2 !== -1) {
    content = content.substring(0, idx2) + lightbox.replace(/\r\n/g, '\n') + '\n    </div>\n  );\n}\n';
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('SUCCESS: Lightbox added (LF)');
  } else {
    console.log('ERROR: Could not find insertion point');
    console.log('Last 200 chars:', JSON.stringify(content.slice(-200)));
  }
}

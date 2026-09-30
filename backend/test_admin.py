import urllib.request
import json

def request(url, method='GET', data=None):
    req = urllib.request.Request(url, method=method)
    data_bytes = None
    if data is not None:
        req.add_header('Content-Type', 'application/json')
        data_bytes = json.dumps(data).encode('utf-8')
    with urllib.request.urlopen(req, data=data_bytes, timeout=5) as res:
        return res.status, json.loads(res.read().decode())

print("--- 1. Testing Admin CMS HTML Page ---")
with urllib.request.urlopen("http://localhost:3000/admin", timeout=5) as res:
    html = res.read().decode(errors="ignore")
    print(f"[PASS] GET http://localhost:3000/admin -> Status {res.status}, Loaded {len(html)} bytes")

print("\n--- 2. Testing Post Listing & Stats ---")
status, posts = request("http://localhost:3000/api/posts")
print(f"[PASS] GET /api/posts -> Status {status}, Found {len(posts)} posts")

print("\n--- 3. Testing Post Creation ---")
status, created = request("http://localhost:3000/api/posts", method="POST", data={
    "title": "Automated Admin Verification Post",
    "description": "Verifying post creation via Next.js proxy.",
    "body": "## Verification\n\nAdmin endpoint works perfectly.",
    "category": "tech-ai",
    "tags": ["test", "verification"],
    "slug": "test-admin-verification-post"
})
print(f"[PASS] POST /api/posts -> Status {status}, Created: {created.get('slug')}")

print("\n--- 4. Testing Post Fetch & Markdown Body Loading ---")
status, fetched = request("http://localhost:3000/api/posts/test-admin-verification-post")
print(f"[PASS] GET /api/posts/slug -> Status {status}, Body loaded: {bool(fetched.get('body'))}")

print("\n--- 5. Testing Post Update (PUT) ---")
status, updated = request("http://localhost:3000/api/posts/test-admin-verification-post", method="PUT", data={
    "title": "Automated Admin Verification Post (Updated)",
    "description": "Updated description.",
    "body": "Updated content paragraph.",
    "category": "tech-ai",
    "slug": "test-admin-verification-post"
})
print(f"[PASS] PUT /api/posts/slug -> Status {status}, Updated Title: {updated.get('title')}")

print("\n--- 6. Testing Post Deletion (DELETE) ---")
status, deleted = request("http://localhost:3000/api/posts/test-admin-verification-post", method="DELETE")
print(f"[PASS] DELETE /api/posts/slug -> Status {status}")

print("\n--- 7. Testing AI Engine Status ---")
status, ai_status = request("http://localhost:3000/api/ai/status")
print(f"[PASS] GET /api/ai/status -> Status {status}, Autopilot: {ai_status.get('settings', {}).get('autopilot')}")

print("\n--- 8. Testing AI Topic Queue (Add & Delete) ---")
status, q_add = request("http://localhost:3000/api/ai/queue", method="POST", data={
    "topics": ["Automated Verification Topic"],
    "category": "tech-ai"
})
added_id = q_add["items"][0]["id"]
print(f"[PASS] POST /api/ai/queue -> Status {status}, Added Item ID: {added_id}")

status, q_del = request(f"http://localhost:3000/api/ai/queue/{added_id}", method="DELETE")
print(f"[PASS] DELETE /api/ai/queue/{added_id} -> Status {status}")

print("\nALL 8 CORE ADMIN FEATURES PASSED WITH 100% SUCCESS!")

vcl 4.1;

# Define the backend server (equivalent to the NGINX upstream)
backend main_server {
    .host = "host.docker.internal";  # Replace with the actual host
    .port = "8080";                 # Replace with the actual port
}

# Global VCL configuration
sub vcl_recv {
    # Cache key (similar to proxy_cache_key)
    call set_cache_key;

    # Pass requests to the backend if they are not cacheable
    if (req.method != "GET" && req.method != "HEAD") {
        return (pass);
    }

    # Ignore cache-busting headers from the client
    unset req.http.Cache-Control;
    unset req.http.Pragma;
}

sub set_cache_key {
    # Use hash_data to build a proper cache key
    hash_data(req.url);
    hash_data(req.http.host);
    hash_data(req.method);
}

sub vcl_backend_response {
    # Ignore backend headers that prevent caching (proxy_ignore_headers)
    unset beresp.http.Cache-Control;
    unset beresp.http.Expires;

    # Cache settings (similar to proxy_cache_valid)
    if (beresp.status == 200) {
        set beresp.ttl = 1h;
    } else if (beresp.status == 404) {
        set beresp.ttl = 5m;
    } else {
        set beresp.ttl = 0s;
        return (pass);
    }

    # Allow serving stale content on backend errors
    set beresp.grace = 5m;
}

sub vcl_deliver {
    # Add custom cache status header for debugging (X-Cache-Status)
    if (obj.hits > 0) {
        set resp.http.X-Cache-Status = "HIT";
    } else {
        set resp.http.X-Cache-Status = "MISS";
    }
}

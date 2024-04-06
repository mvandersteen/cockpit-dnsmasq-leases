const button = document.getElementById("ap-connections-refresh");
const result = document.getElementById("result");

function leases_run() {
    /* global cockpit */
    cockpit.spawn(["cat", "/var/lib/misc/dnsmasq.leases"])
            .stream(leases_output)
            .then(leases_success)
            .catch(leases_fail);

    result.textContent = "";
}

function leases_success() {
    result.style.color = "green";
    result.textContent = "success";
}

function leases_fail() {
    result.style.color = "red";
    result.textContent = "fail";
}

function leases_output(data) {
    lines = data.split("\n")
    if (lines.length > 0) { document.querySelector("#results tbody").remove() } 
    if (!document.querySelector("#results tbody")) { document.querySelector("#results").innerHTML += '<tbody></tbody>' }
    lines.forEach((e) => document.querySelector("#results tbody").innerHTML += splitEntry(e))
}

// Update header text
function splitEntry(entry) {
    parts = entry.split(" ")
    date = new Date(Number(parts[0]) * 1000).toLocaleString()
    macAddr = parts[1]
    ipAddr = parts[2]
    dnsName = parts[3]
    
    if (dnsName ) {
        return `<tr class=""><th data-label="DnsName" scope="col" class="">${dnsName}</th><td data-label="IP address" class="">${ipAddr}</td><td data-label="mAC Address" class="">${macAddr}</td><td data-label="Lease Expires" class="">${date}</td></tr>`
    }
    else { return ''}

}
//output.append(document.createTextNode(data));
//}

// Connect the button to starting the "ping" process
button.addEventListener("click", leases_run);
window.onload = leases_run;

// Send a 'init' message.  This tells integration tests that we are ready to go
cockpit.transport.wait(function() { });
